/**
 * Interface for the Sow
 * 2:25 AM 4/11/2019
 */
interface IHook {
    hook( b: string ): IHook;
    add( name: string, fn: Function ): IHook;
    firea( ...args: any[] ): IHook;
    fire( ...args: any[] ): IHook;
    remove( schema: string, name: string ):IHook;
}
interface IMultiInherit {
    inherit: ( ...args: Function[]) => Function;
}
interface IIAssembler {
    Create: IAssembler;
}
interface IAssembler {
    (): IIAssembler;
    new(): IAssembler;
    Class( ...args: Function[] ): Function;
    extend( destination: Function | Object, source: Function | Object ): Object;
    aggregate( ...args: Function | Object[] ): Object;
    Closure( ...args: Function[] ): IAssembler;
}
interface IStatic {
    all( obj: Object ): Object;
    define( obj: Object, poperty: string, value: any ): Object;
    change( obj: Object, poperty: string, value: any ): Object;
}
interface IData {
    set( mom: string | Object, child: string | Object, value: any ): IData;
    get( mom: string | null, child: string | Object | null, deep: string | null, deeper: string | null ): Object | any;
    push( mom: string | Object, child: string | Object, value: any ): IData;
    clean(): IData;
    clear( name: string ): IData;
}
interface SowStatic {
    define( name: string, fun: Function ): Sow;
    export( name: string, obj: Object, objectToExportTo: Object | null ): object;
    isError( obj: Object ): boolean;
    isArrayLike( obj: Object ): boolean;
    isPlainObject( obj: Object ): boolean;
    isDate( obj: Object ): boolean;
    JSON( str: string ): [];
    hook( schema: string, child: string ): IHook;
    multi: IMultiInherit;
    Assembler: IAssembler;
    registerNamespace( namespaceName: string, modules: Function ): Sow;
    mapNamespace( parent: string, child: string | [] ): Sow;
    namespaceExists( namespaceName: string ): boolean;
    reRegisterNamespace( namespaceName: string ): Sow;
    removeRegistry( namespaceName: string ): Sow;
    usingNamespace( namespaceName: string, removeRegistry: boolean | void ): Sow;
    exportNamespace( namespaceName: string ): Object;
    unloadNamespace( namespaceName: string ): Sow;
    defineModule( name: string, _module: Object | any ): Sow;
    exportModule( name: string ): Sow;
    remove( name: string ): Sow;
    /**
    * Call the argument with Sow instance.
    * 
    * @param func Function.
    */
    Run( func: Function ): Sow;
    onRouterChange( event: any ): Sow;
    Static: IStatic;
    async( func: Function, delay: number, args: [] ): Sow;
    await( func: Function, delay: number, args: [] ): Sow;
    /**
    * Define platform.
    */
    OS: string;
    /**
    * Define Device
    */
    Device: {
        isTouchDevice: string;
        deviceType: string;
    };
    dom: {
        isHighDensity: boolean;
        isRetina: boolean;
        isSmartPhone: boolean;
        isTablet: boolean;
        isDesktop: boolean;
    };
    browser: {
        Promise: {
            support: boolean;
        };
        blob: {
            support: boolean;
        };
        name: string;
        support( options: Object ): boolean;
        version: number;
        type: string;
        workerThread: {
            support: boolean;
        };
    };
    Data: {
        new(): {
            export(): IData;
        };
    };
    onXHRError( jqXHR: JQueryXHR, uac: number | any, msg: string | any ): Object;
    loader: {
        show(): any;
        hide(): any;
    };
    date: {
        getLocal( offset: string, d: Date | any ): Date;
        format( arg1: any | string, arg2: any | Date ): string;
    };
}
declare var Sow: SowStatic;