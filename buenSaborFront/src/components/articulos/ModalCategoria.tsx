import React, { useEffect, useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import Categoria from '../../models/Categoria';
import { getArbolCategorias, getCategoriaPadreDesdeHijo, getCategoriaPorID, saveCategoria } from '../../services/CategoriaApi';

interface ModalProps {
    showModal: boolean;
    handleClose: () => void;
    editing?: boolean;
    categoriaSeleccionada?: Categoria | null;
    getListadoCategorias: () => void;
}

export const ModalCategoria: React.FC<ModalProps> = ({ showModal, handleClose, editing, categoriaSeleccionada, getListadoCategorias }) => {

    const [newCategoria, setNewCategoria] = useState<Categoria>(new Categoria());
    const [categorias, setCategorias] = useState<Categoria[]>([]);
    const [txtValidacion, setTxtValidacion] = useState<string>("");

    const handleCloseAndClear = () => {
        handleClose();
        setTxtValidacion("");
        setNewCategoria(new Categoria());
    };

    useEffect(() => {
        const fetchAndProcessCategories = async () => {
            try {
                const data = await getArbolCategorias();
                setCategorias(data);
                if (categoriaSeleccionada && categoriaSeleccionada.id) {
                    const categoriaPadre = await getCategoriaPadreDesdeHijo(categoriaSeleccionada.id)
                    categoriaPadre && categoriaPadre.id ? setNewCategoria({ ...categoriaSeleccionada, categoriaPadre })
                        : setNewCategoria(categoriaSeleccionada);
                }
            } catch (e) {
                console.error(e);
            }
        };

        fetchAndProcessCategories()
    }, [categoriaSeleccionada]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTxtValidacion("");
        setNewCategoria({ ...newCategoria, [e.target.name]: e.target.value });
    };

    const handleSelectChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {

        const selectedCategoriaId = Number(e.target.value);
        const selectedCategoria = await getCategoriaPorID(selectedCategoriaId)//categorias.find(c => c.id === selectedCategoriaId);
        console.log(selectedCategoria)
        setNewCategoria({ ...newCategoria, categoriaPadre: selectedCategoria || null });
    };

    const generateCodigo = (parentCodigo: string | null, categoriaPadre: Categoria[]): string => {
        if (!parentCodigo) {
            // No parent means it's a root category
            const lastRootCodigo = categorias
                .filter(c => !c.categoriaPadre)
                .map(c => parseInt(c.codigo))
                .sort((a, b) => b - a)[0] || 0;
            return `${lastRootCodigo + 1}`;
        } else {
            // It's a subcategory
            const ultimoCodigo = categoriaPadre[0].subCategorias
                .map(s => parseInt(s.codigo.split('.').pop()!))
                .sort((a, b) => b - a)[0] || 0;

            return `${parentCodigo}.${ultimoCodigo + 1}`;
        }
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        if (newCategoria.denominacion === undefined || newCategoria.denominacion === "") {
            setTxtValidacion("Debe ingresar una denominacion");
            return;
        }
        const parentCodigo = newCategoria.categoriaPadre?.codigo || null;
        const categoriaPadre = categorias.filter(c => c.id === newCategoria.categoriaPadre?.id && c.subCategorias);
        newCategoria.codigo = generateCodigo(parentCodigo, categoriaPadre);
        await saveCategoria(newCategoria);

        handleCloseAndClear();
        getListadoCategorias()
    };

    const renderCategorias = (categorias: Categoria[]): JSX.Element[] => {
        return categorias.filter(c => !c.eliminado).map((categoria: Categoria) => {
            return (
                <React.Fragment key={categoria.id}>
                    <option value={categoria.id}>{categoria.codigo} {categoria.denominacion}</option>
                    {renderCategorias(categoria.subCategorias)}
                </React.Fragment>
            );
        });
    };

    return (
        <Modal show={showModal} onHide={handleCloseAndClear}>
            <Modal.Header closeButton>
                <Modal.Title>{editing ? 'Editar' : 'Añadir'} Categoria</Modal.Title>
            </Modal.Header>

            <Modal.Body>
                <Form onSubmit={handleSubmit}>
                    {newCategoria.codigo &&
                        <Form.Group className="mb-3">
                            <Form.Label>Codigo</Form.Label>
                            <Form.Control type="text" name="codigo" value={newCategoria.codigo || ''} onChange={handleInputChange} disabled />
                        </Form.Group>
                    }
                    <Form.Group className="mb-3">
                        <Form.Label>Denominacion</Form.Label>
                        <Form.Control type="text" name="denominacion" value={newCategoria.denominacion || ''} onChange={handleInputChange} />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Categoria Padre</Form.Label>
                        <Form.Select name="categoriaPadre" onChange={handleSelectChange} value={newCategoria.categoriaPadre?.id || 0}>
                            <option value={0}>Seleccione una categoria padre</option>
                            {renderCategorias(categorias)}
                        </Form.Select>
                    </Form.Group>

                    <div>
                        <p style={{ color: 'red', lineHeight: 5, padding: 5 }}>{txtValidacion}</p>
                    </div>
                    <Button style={{ backgroundColor: '#83CA6A' }} type="submit">
                        Guardar
                    </Button>
                </Form>
            </Modal.Body>

            <Modal.Footer>
                <Button variant="secondary" onClick={handleCloseAndClear}>Cerrar</Button>
            </Modal.Footer>
        </Modal>
    );
};
