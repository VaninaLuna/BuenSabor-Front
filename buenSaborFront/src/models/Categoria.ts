export default class Categoria{
    id:number = 0;
    codigo:string = "";
    denominacion:string = "";
    eliminado: boolean = false;
    categoriaPadre?:Categoria | null;
    subCategorias:Categoria[] = [];
}
