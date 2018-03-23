/**======================================================================*/
/** If window is Undefined*/
window !== 'undefined' ? '' : ( window = this );
( function ( global, factory ) {
	if ( typeof ( module ) === "object" && typeof ( module.exports ) === "object" ) {
		module.exports = global.document ? factory( global, true ) :
			function ( w ) {
				if ( !w.document ) {
					throw new Error( "Sow.Framework.js requires a window with a document" );
				}
				return factory( w );
			};
	} else {
		factory( global );
	}
	/** Pass this if window is not defined yet*/
}( typeof ( window ) !== 'undefined' ? '' : this, function ( _window, noGlobal ) {
	'use strict';
	window !== 'undefined' ? '' : ( window = _window, _window = undefined );
	/** [String Format ]*/
	//String.format('{0} is dead, but {1} is alive! {0} {2}', 'ASP', 'ASP.NET');
	( typeof ( String.format ) === 'function' ? undefined : String.format = function ( format ) {
		var args = Array.prototype.slice.call( arguments, 1 );
		return format.replace( /{(\d+)}/g, function ( match, number ) {
			return typeof args[number] != 'undefined'
				? args[number]
				: match
				;
		} );
	} );
	/** [/String Format ]*/
	/** [Object Extend]*/
	( typeof ( Object.extend ) === 'function' ? undefined : ( Object.extend = function ( destination, source ) {
		for ( var property in source )
			destination[property] = source[property];
		return destination;
	} ) );
	/** [/Object Extend]*/
	/** [Object clone]*/
	( typeof ( Object.clone ) === 'function' ? undefined : ( Object.clone = function ( object ) {
		return this.extend( {}, object );
	} ) );
	/** [/Object clone]*/
	/** [Function Extend]*/
	( typeof ( Function.extend ) === 'function' ? undefined : Function.prototype.extend = function ( obj ) {
		if ( typeof ( this ) !== 'function' ) {
			console.warn( typeof ( this ) );
		}
		if ( obj === null || typeof ( obj ) !== 'object' ) {
			return this;
		}
		if ( !( obj instanceof {}.constructor ) ) {
			return this;
		}
		Object.extend( this, obj );
		return this;
	} );
	/** [/Function Extend]*/
	( typeof ( Array.prototype.indexOf ) === "function" ? undefined : ( Array.prototype.indexOf = function ( d, e ) {
		var a;
		if ( null == this ) throw new TypeError( '"this" is null or not defined' );
		var c = Object( this ),
			b = c.length >>> 0;
		if ( 0 === b ) return -1;
		a = +e || 0;
		Infinity === Math.abs( a ) && ( a = 0 );
		if ( a >= b ) return -1;
		for ( a = Math.max( 0 <= a ? a : b - Math.abs( a ), 0 ); a < b; ) {
			if ( a in c && c[a] === d ) return a;
			a++
		}
		return -1
	} ) );
	( typeof ( String.prototype.in ) === "function" ? undefined : ( String.prototype.in = function () {
		if ( ( arguments[0] instanceof [].constructor ) ) {
			return arguments[0].indexOf( this.toString() ) < 0 ? false : true;
		}
		return Array.prototype.slice.call( arguments, 0 ).indexOf( this.toString() ) < 0 ? false : true;
	} ) );
	( typeof ( Number.prototype.in ) === "function" ? undefined : ( Number.prototype.in = function () {
		var val = this.toString(); val = parseInt( val );
		if ( isNaN( val ) ) { return false; }
		if ( ( arguments[0] instanceof [].constructor ) ) {
			return arguments[0].indexOf( val ) < 0 ? false : true;
		}
		return Array.prototype.slice.call( arguments, 0 ).indexOf( val ) < 0 ? false : true;
	} ) );
	( typeof ( Element.prototype.removeAttribute ) === "function" ? undefined : ( Element.prototype.removeAttribute = function ( internalKey ) {
		this[internalKey] = null;
	} ) );
	( typeof ( Element.prototype.setAttribute ) === "function" ? undefined : ( Element.prototype.setAttribute = function ( internalKey ) {
		this[internalKey] = value;
	} ) );
	/** [Element] **/
	/** [Element.remove()] **/
	if ( typeof ( Element.prototype.remove ) !== 'function' ) {
		Element.prototype.remove = function () {
			if ( this.parentElement === null ) {
				//console.trace();
				console.warn( 'Invalid parent element...!' );
				return this;
			}
			this.parentElement.removeChild( this );
			return this;
		}
		NodeList.prototype.remove = HTMLCollection.prototype.remove = function () {
			var i = this.length;
			typeof ( i ) !== 'number' ? ( i = 0 ) : ( i = i - 1 );
			while ( i-- ) {
				!( this[i] && this[i].parentElement ) ? '' : this[i].parentElement.removeChild( this[i] )
			}
			return this;
		}
	};
	/** [/Element.remove()] **/
	/** [Element.getAttributes] **/
	( typeof ( Element.prototype.getAttributes ) === "function" ? undefined : ( Element.prototype.getAttributes = function ( attrname ) {
		var i, ilen, out;
		if ( !attrname ) { return undefined; }
		if ( typeof this.attributes !== 'object' ) { return undefined; }
		i = 0, ilen = this.attributes.length, out = '';
		for ( ; i < ilen; i++ ) {
			if ( this.attributes[i].name !== attrname ) {
				continue;
			}
			out = this.attributes[i].value; break;
		}
		return out;
	} ) );
	/** [/Element.getAttributes] **/
	/** [String.prototype.repeat] **/
	( typeof ( String.prototype.repeat ) === "function" ? undefined : ( String.prototype.repeat = function ( count ) {
		if ( count < 1 ) return '';
		var result = '', pattern = this.valueOf();
		while ( count > 1 ) {
			if ( count & 1 ) result += pattern;
			count >>= 1, pattern += pattern;
		}
		return result + pattern;
	} ) );
	/** [String.prototype.repeat] **/
	/** [/Element] **/
	window.Sow = function () {
		/*Export Function*/
		return {
			define: function define( name, fun ) {
				if ( typeof ( fun ) !== 'function' )
					throw new Error( 'Invalid function defined in Sow.define instead of function. Args- ' + typeof ( fun ) );
				try {
					let obj = this.export( name ), exports;
					exports = fun.call( this );
					!this.isPlainObject( obj ) ? ( console.error( 'Invalid object define in Sow.define...! Object type ' + typeof ( obj ) + ';' ), false )
						: !this.isPlainObject( exports ) ? ( console.error( 'Invalid object define in Sow.define...! Exports type ' + typeof ( exports ) + ';' ), false ) : function () {
							for ( let propertyName in exports ) {
								/** Maybe we should check the prototype chain here? The current usage*/
								/** pattern is always using an object literal so we only care about own*/
								/** properties.*/
								let propertyDescriptor = Object.getOwnPropertyDescriptor( exports, propertyName );
								if ( propertyDescriptor ) { Object.defineProperty( obj, propertyName, propertyDescriptor ); }
							}
							return undefined;
						}.call( { object: undefined }/** Function inheritance*/ );
				} catch ( ex ) {
					console.warn( ex.message );
				}
				return this;
			},
			export: function ( name, object, objectToExportTo ) {
				return typeof ( name ) !== 'string' ? undefined : function () {
					var parts = name.split( '.' ), cur, part, isCheck;
					isCheck = typeof ( object ) === 'boolean' ? true : typeof ( object ) === 'object' ? 'obj' : false;
					cur = objectToExportTo || window;
					for ( part; parts.length && ( part = parts.shift() ); ) {
						if ( !parts.length && isCheck === 'obj' ) {
							/** last part and we have an object; use it*/
							cur[part] = object; continue;
						}
						if ( part in cur ) {
							cur = cur[part]; continue;
						}
						if ( isCheck ) { return false; }
						cur = cur[part] = {};
					}
					return cur;
				}.call( { object: undefined }/** Function inheritance*/ );
			},
			isError: function ( obj ) {
				/// <summary>Checks whether the specified value is a Error Exception Object.</summary>
				/// <param name="value">Value to check.</param>
				/// <returns type="Boolean">true if the value is a Error Exception Object; false otherwise.</returns>
				return Object.prototype.toString.call( obj ) === "[object Error]";
			},
			isArrayLike: function isArrayLike( obj ) {
				/// <summary>Checks whether the specified value is an array object.</summary>
				/// <param name="value">Value to check.</param>
				/// <returns type="Boolean">true if the value is an array object; false otherwise.</returns>
				if ( obj === null || obj === undefined ) return false;
				var result = Object.prototype.toString.call( obj );
				if ( result === "[object NodeList]" || result === "[object Array]" ) {
					return true;
				}
				return false;
			},
			isPlainObject: function ( obj ) {
				/// <summary>Tests whether a value is an object.</summary>
				/// <param name="value">Value to test.</param>
				/// <returns type="Boolean">True is the value is an object; false otherwise.</returns>
				//return typeof value === "object";
				if ( obj === null || obj === undefined ) return false;
				return obj === null ? false : typeof ( obj ) !== 'object' ? false : !obj instanceof {}.constructor ? false : true;
			},
			isDate: function () {
				/// <summary>Checks whether the specified value is a Date object.</summary>
				/// <param name="value">Value to check.</param>
				/// <returns type="Boolean">true if the value is a Date object; false otherwise.</returns>
				return Object.prototype.toString.call( value ) === "[object Date]";
			},
			parseJSONObject: function ( obj ) {
				/// <summary>Parse JSON Object whether the specified value is a JSON object.</summary>
				if ( obj === null ) return [];
				if ( this.isArrayLike( obj ) ) {
					return obj;
				}
				try {
					return JSON.parse( obj );
				} catch ( e ) {
					console.log( e.message );
				}
				return [];
			},

		}
	}();
	Sow.define( 'Sow', function () {
		var _worker_ = {
			Create: {
				Class: function Class() {
					var describe, fields, i, len, names, constructor, hasConstructor, ancestor, descriptor, prototype;
					if ( arguments.length > 1 ) {
						fields = {};
						for ( i = 0, len = arguments.length; i < len; i++ ) {
							this.extend( fields, ( typeof ( arguments[i] ) === 'function' ? arguments[i].call( this ) : arguments[i] ) );
						}
					} else {
						typeof ( arguments[0] ) === 'function' ? ( fields = arguments[0].call( this ) ) : ( fields = arguments[0] );
					}
					hasConstructor = true;
					names = Object.keys( fields );
					constructor = names.indexOf( "constructor" ) >= 0 ? fields.constructor :
						( hasConstructor = false, function () { } );
					ancestor = fields.extends || Object;
					describe = Object.getOwnPropertyDescriptor;
					descriptor = names.reduce( function ( descriptor, key ) {
						descriptor[key] = describe( fields, key );
						return descriptor;
					}, {} );
					prototype = Object.create( ancestor.prototype, descriptor );
					constructor.prototype = prototype;
					hasConstructor === false ? undefined : prototype.constructor = constructor;
					fields = i = len = names = hasConstructor = ancestor = descriptor = prototype = describe = undefined;
					return constructor;
				},
				extend: function extend( destination, source ) {
					var property;
					if ( !( destination instanceof {}.constructor ) || !( source instanceof {}.constructor ) ) {
						if ( typeof ( destination ) !== 'function' || !( source instanceof {}.constructor ) )
							throw new Error( 'Invalid Object type define in Sow.Assembler.Create.extend...! \r\n Destination type ' + typeof destination + '; \r\n Source type ' + typeof source + ';' );
					}
					typeof ( destination ) === 'function' ? ( destination = destination.call( this ) ) : undefined;
					typeof ( source ) === 'function' ? ( source = source.call( this ) ) : undefined;
					return Object.extend( destination, source );
				},
				aggregate: function aggregate() {
					var fields;
					if ( arguments.length <= 1 ) {
						return typeof ( arguments[0] ) === 'function' ? ( fields = arguments[0].call( this ), fields ) : ( fields = arguments[0], fields );
					}
					fields = {};
					for ( let i = 0, len = arguments.length; i < len; i++ ) {
						this.extend( fields, ( typeof ( arguments[i] ) === 'function' ? arguments[i].call( this ) : arguments[i] ) );
					}
					return fields;
				},
				Closure: function Closure() {
					try {
						if ( arguments.length <= 1 ) {
							typeof ( arguments[0] ) === 'function' ? arguments[0].call( this ) : console.warn( 'Invalid function define in Sow.Assembler.closure...! \r\n Function type ' + typeof arguments[0] + ';\r\n' + arguments.callee.caller.toString() );
							return this;
						}
						for ( i = 0, len = arguments.length; i < len; i++ ) {
							typeof ( arguments[i] ) === 'function' ? arguments[i].call( this ) : console.warn( 'Invalid function define in Sow.Assembler.closure...! \r\n Function type ' + typeof arguments[i] + ';\r\n' + arguments.callee.caller.toString() );
						}
						return this;
					} catch ( ex ) {
						if ( arguments.callee.caller ) {
							console.warn( ex.message + '\r\n Caller is `' + arguments.callee.caller.name + '`\r\n..' + arguments.callee.caller.toString() );
							return this;
						}
						console.warn( ex.message );
						return this;
					}
				}
			}
		};
		return {
			Assembler: _worker_.Create.aggregate( function () {
				var fnc = this.Class( _worker_ );/** _worker_.class(_worker_);*/
				fnc.extend( _worker_ ); _worker_ = undefined;
				return fnc;
			} )
		};
	} )
		// Moduler
		.define( 'Sow', function () {
			'use strict'
			var _MODULE_, _REGISTRY_, CREATE;
			CREATE = ( new this.Assembler() ).Create;
			_MODULE_ = CREATE.aggregate( function () {
				var Global = {
					settings: {
						path: undefined,
						isClass: true
					}
				}
				return {
					blueprint: this.aggregate( function () {
						var publicModule = {
							export: {

							},
							require: function ( x, y ) {
								if ( typeof ( publicModule.export[x] ) !== 'object' )
									return {};

								if ( typeof ( y ) === 'string' ) {

									if ( typeof ( publicModule.export[x][y] ) === 'function' )
										return publicModule.export[x][y]();

									return {};
								}
								let out = {};
								for ( let o in publicModule.export[x] ) {

									if ( o === '___REMOVE___' || o === '___EXTEND___' ) continue;

									if ( typeof ( publicModule.export[x][o] ) !== 'function' ) continue;

									let obj = publicModule.export[x][o]();

									if ( typeof ( obj ) === 'function' ) {
										out[obj.name] = obj;
										continue;
									}

									Object.extend( out, obj );
								}
								return out;
							}
						};
						return {
							exportNamespace: function ( namespaceName ) {
								return publicModule.require( namespaceName );
							},
							unloadNamespace: function ( namespaceName ) {
								if ( typeof ( publicModule.export[namespaceName] ) !== 'object' )
									throw new Error( String.format( "Invalid Namespace defined =>{0}; Please at first use Namespace then unloadNamespace.", namespaceName ) );
								if ( typeof ( publicModule.export[namespaceName]['___REMOVE___'] ) === 'function' )
									publicModule.export[namespaceName]['___REMOVE___']( namespaceName );
								delete publicModule.export[namespaceName];
								return this;
							},
							reRegisterNamespace: function ( namespace, modules, entry ) {
								if ( typeof ( publicModule.export[namespace] ) !== 'object' )
									throw new Error( String.format( "Invalid Namespace defined =>{0}; Please at first Use Namespace then reRegisterNamespace.", namespace ) );
								if ( typeof ( publicModule.export[namespace]['___REMOVE___'] ) !== 'function' )
									throw new Error( String.format( "Unable to remove Namespace =>{0}.", namespace ) );
								if ( typeof ( publicModule.export[namespace]['___EXTEND___'] ) !== 'function' )
									throw new Error( String.format( "This Namespace =>{0} not supported reRegisterNamespace method.", namespace ) );
								publicModule.export[namespace]['___REMOVE___']( namespace, true );
								publicModule.export[namespace]['___EXTEND___']( function () {
									this.prepare( namespace, modules, entry, false, true );
								}, true );
								return this;
							},
							extendNamespace: function ( destinationNamespace, namespace, modules, entry ) {
								if ( typeof ( publicModule.export[destinationNamespace] ) !== 'object' )
									throw new Error( String.format( "Invalid Namespace defined =>{0}; Please at first use Namespace then reRegisterNamespace.", destinationNamespace ) );
								if ( typeof ( publicModule.export[destinationNamespace]['___EXTEND___'] ) !== 'function' )
									throw new Error( String.format( "This Namespace =>{0} not supported extend method.", destinationNamespace ) );
								if ( typeof ( publicModule.export[namespace] ) === 'object' ) {
									if ( typeof ( publicModule.export[namespace]['___REMOVE___'] ) === 'function' )
										publicModule.export[namespace]['___REMOVE___']( namespace );
								}
								publicModule.export[destinationNamespace]['___EXTEND___']( function () {
									this.extend( destinationNamespace, modules, entry, false );
								} );
								return this;
							},
							initialize: this.aggregate( function () {
								var Initialize = {
									private: function () {
										var __module = {
											export: {
												private: {
													require: function ( name, key ) {
														return function ( x, y ) {

															try {

																let id = __module.export.private[name][key].entry[x];

																if ( id !== undefined ) {
																	return __module.export.private[name][id].method;
																}

																return publicModule.require( x, y );

															} catch ( e ) {
																console.log( e.message );
																return {};
															}
														}
													}
												},
												public: {},
											},
										};
										return {
											module: {
												bingtransmit: function ( name, key, modules, isExport, extend ) {
													let isPrivate, isClass;

													isPrivate = modules[1].private;

													isPrivate ? undefined : typeof ( modules[1].public ) === 'boolean' && modules[1].public !== false ? isPrivate = false : isPrivate = true;

													if ( extend.isExtend ) {

														if ( !( __module.export.private[name][extend.ext_key] instanceof {}.constructor ) )
															throw new Error( String.format( 'Invalid extend entry==> `{0}` defined in Namespace ===> `{1}`..!', key, name ) );

														Object.extend( __module.export.private[name][extend.ext_key].method, modules[0].call(
															__module.export.private[name][extend.ext_key].method,
                                                        /** Require*/__module.export.private.require( name, extend.ext_key ),
															this, { object: undefined }
														) );

													} else {

														__module.export.private[name][key] = {
															entry: {},
															method: {}
														};

														__module.export.private[name][key].method = modules[0].call(
															__module.export.private[name][key].method,
															/** Require*/__module.export.private.require( name, key ),
															this, { object: undefined }
														);
													}

													isClass = modules[1].class;

													for ( let property in modules[1] ) {
														if ( property === 'private' || property === 'class' || property === "isExtend" || property === "ext_key" ) {
															continue;
														}
														if ( !extend.isExtend ) {
															__module.export.private[name][key].entry[property] = modules[1][property];
															continue;
														}
														__module.export.private[name][extend.ext_key].entry[property] = modules[1][property];

														/**if ( !( __module.export.private[name][extend.ext_key].entry[property] instanceof {}.constructor ) )
															__module.export.private[name][extend.ext_key].entry[property] = {};
	    
														Object.extend( __module.export.private[name][extend.ext_key].entry[property], modules[1][property] );*/
													}
													if ( !isPrivate ) {

														if ( typeof ( publicModule.export[name][modules[1].owner] ) === 'function' )
															throw new Error( String.format( "This owner already exists. Owner=>{0}; Please try another name.", modules[1].owner ) );
														if ( extend.isExtend ) {
															publicModule.export[name][modules[1].owner] = function () {
																return __module.export.private[name][extend.ext_key].method;
															};
														} else {
															publicModule.export[name][modules[1].owner] = function () {
																return __module.export.private[name][key].method;
															};
														}

													}
													modules = undefined;
													if ( isPrivate ) {
														return {};
													}
													if ( isClass ) {
														return extend.isExtend ? __module.export.private[name][extend.ext_key].method : __module.export.private[name][key].method;
													}
													if ( isExport ) {
														return extend.isExtend ? __module.export.private[name][extend.ext_key].method : __module.export.private[name][key].method;
													}
													return {};
												},
												extend: function ( name, modules, entry ) {
													if ( !( __module.export.private[name] instanceof {}.constructor ) )
														throw new Error( String.format( 'No such Namespace ===> `{0}`..!', name ) );
													this.prepare( name, modules, entry, false, false );

													return this;
												},
												int: function ( name ) {
													if ( __module.export.private[name] )
														throw new Error( String.format( 'This Namespace===> {0} already exists..!', name ) );

													publicModule.export[name] = {};
													__module.export.private[name] = {};
													return this;
												},
												prepare: function ( name, modules, entry, isExport, doInt ) {
													doInt === undefined ? doInt = true : undefined;
													if ( doInt === true ) {
														this.int( name );
													}
													let i, len, property, fields, support, ep;
													var out = {};
													support = new Sow.Assembler().Create;
													len = entry.length; ep = [];
													let isExtend = false, key, extend = {};
													for ( i = 0; i < len; i++ ) {

														key = entry[i];

														if ( !( modules[key] instanceof [].constructor ) )
															throw new Error( String.format( 'No such module defined for entry==> `{0}` in Namespace ===> `{1}`..!', key, name ) );

														isExtend = modules[key][1].isExtend === false || modules[key][1].isExtend === undefined ? false : true;

														if ( ep.indexOf( key ) > -1 )
															throw new Error( String.format( 'Duplicate entry==> `{0}` defined in Namespace ===> `{1}`..!', key, name ) );

														extend = {
															isExtend: false
														};
														ep.push( key );

														if ( isExtend ) {
															extend = {
																ext_key: modules[key][1].ext_key,
																isExtend: true
															};
															if ( !extend.ext_key )
																throw new Error( String.format( 'Invalid ext entry==> `{0}` defined in Namespace ===> `{1}`..!', extend.ext_key, name ) );
															if ( doInt === true ) {
																if ( ep.indexOf( extend.ext_key ) <= -1 )
																	throw new Error( String.format( 'Invalid extend entry==> `{0}` defined in Namespace ===> `{1}`..!', key, name ) );
															}
														}
														fields = this.bingtransmit.call( support, name, key, modules[key], isExport, extend );

														if ( !isExport ) continue;

														for ( property in fields )
															out[property] = fields[property];
													}
													ep = len = property = fields = modules = entry = support = isExport = undefined;
													if ( !doInt ) return this;
													/**[Extend Module remove function]*/
													out['___REMOVE___'] = function ( inst ) {
														if ( typeof ( __module.export.private[name] ) === 'object' ) {
															delete __module.export.private[name];
														}
														if ( typeof ( __module.export.public[name] ) === 'object' ) {
															delete __module.export.public[name];
														}
														if ( !inst )
															inst = name;

														out = name = undefined;
														/**[Remove from global object.]*/
														for ( var i in this ) {
															this[i] = function postMortem() {
																throw new Error( 'This method cannot be called because this `' + inst + '` has been destroyed ! :\/' );
															};
														}
														return this;
													};
													var that = this;
													publicModule.export[name]['___REMOVE___'] = function ( inst, partial ) {
														if ( !partial === true ) {
															that = undefined;
														}
														out['___REMOVE___']( inst );
														return this;
													};

													publicModule.export[name]['___EXTEND___'] = function ( ecb, removeInst ) {
														typeof ( ecb ) === "function" ? ecb.call( that ) : undefined;
														if ( removeInst === true ) that = undefined;
														return this;
													};
													if ( !isExport )
														return;
													return out;
												}
											}
										}
									}
								};
								return function ( settings, modules, cache, entry, isExport ) {
									if ( arguments.length < 4 )
										throw new Error( 'Invalid Namespace defined..!' );

									if ( !settings instanceof {}.constructor || !modules instanceof {}.constructor ||
										!cache instanceof {}.constructor ||
										!entry instanceof [].constructor )
										throw new Error( 'Invalid Namespace defined!' );

									if ( !entry instanceof [].constructor )
										throw new Error( 'Invalid Namespace Entry defined..! \r\n Entry type ' + typeof entry );

									let property, module_settings = {};

									for ( property in Global.settings ) {
										module_settings[property] = ( settings[property] !== undefined ? ( settings[property] ) : ( Global.settings[property] ) );
									}

									if ( module_settings.isClass ) {
										return new Sow.Assembler().Create.Class( Initialize.private().module.prepare( module_settings.path, modules, entry, isExport ) );
									}

									if ( isExport ) {
										return Initialize.private().module.prepare( module_settings.path, modules, entry, isExport );
									}

									Initialize.private().module.prepare( module_settings.path, modules, entry, isExport );
									return;
								}
							} )
						};
					} )
				}
			} );
			_REGISTRY_ = CREATE.aggregate( function () {
				var _MODULE_Bucket = {};
				return {
					add: function ( settings, module ) {
						var xlen = arguments.length;
						if ( xlen < 4 )
							throw new Error( 'Invalid Namespace defined!!!' );

						if ( !arguments[0]/**settings*/ instanceof {}.constructor ||
							!arguments[1]/**modules*/ instanceof {}.constructor ||
							!arguments[2]/**cache*/ instanceof {}.constructor ||
							!arguments[3]/**entry*/ instanceof [].constructor
						)
							throw new Error( 'Invalid Namespace define!' );

						if ( !arguments[3] instanceof [].constructor )
							throw new Error( 'Invalid Namespace Entry define..! \r\n Entry type ' + typeof ( arguments[3] ) );

						if ( !arguments[0].path )
							throw new Error( 'Invalid Namespace path..' );

						if ( typeof ( _MODULE_Bucket[arguments[0].path] ) === 'function' )
							throw new Error( 'Namespace exist..' );

						var public_module = [];

						for ( var x = 0; x < xlen; x++ ) {
							public_module.push( arguments[x] );
						}
						public_module.push( true );
						_MODULE_Bucket[public_module[0].path] = function () {
							return public_module;
						};
						return this;
					},
					getModule: function ( isExport, /**[settings]*/a, /**[modules]*/b ) {
						var public_module, xlen;
						public_module = [];
						xlen = b.length;
						public_module.push( a ); a = undefined;
						for ( var x = 0; x < xlen; x++ ) {
							public_module.push( b[x] );
						}
						public_module.push( isExport/**[Notify that We want to export! :)]*/ ); b = undefined;
						return public_module;
					},
					function: function () {
						var xlen = arguments.length;

						if ( xlen < 3 || xlen > 3 )
							throw new Error( 'Invalid Namespace define !' );

						if ( !arguments[0]/**settings*/ instanceof {}.constructor || typeof ( arguments[1] )/**modules*/ !== 'function' || typeof ( arguments[2] )/**modules*/ !== 'boolean' )
							throw new Error( 'Invalid Namespace define!' );

						if ( !arguments[0].path && arguments[2] === false )
							throw new Error( 'Invalid Namespace Name..' );

						if ( arguments[2] === true ) {

							if ( typeof ( _MODULE_Bucket[arguments[0].path] ) !== 'object' )
								throw new Error( String.format( 'This Namespace==> `{0}` doesn\'t exist.. You should not extend ==> `{0}` Namespace .', arguments[0].path ) );

							if ( _MODULE_Bucket[arguments[0].path].initialize === true )
								throw new Error( String.format( 'You should not extend Namespace==> `{0}` after Initialize..', arguments[0].path ) );

							if ( !( _MODULE_Bucket[arguments[0].path].module instanceof [].constructor ) )
								throw new Error( String.format( 'This Namespace==> `{0}` is Static.. You should not extend ==> `{0}` Namespace .', arguments[0].path ) );

							_MODULE_Bucket[arguments[0].path].module.push( arguments[1] );

							return this;

						}

						if ( typeof ( _MODULE_Bucket[arguments[0].path] ) === 'function' )
							throw new Error( String.format( 'This Namespace==> `{0}` already exists..', arguments[0].path ) );

						//INITIALIZE
						_MODULE_Bucket[arguments[0].path] = {
							initialize: false,
							settings: arguments[0],
							module: []
						};

						_MODULE_Bucket[arguments[0].path].module.push( arguments[1] );

						return this;
					},
					remove: function ( name ) {
						if ( _MODULE_Bucket[name] ) {
							_MODULE_Bucket[name] = undefined;
							delete _MODULE_Bucket[name];
						}
						return this;
					},
					initializeModule: function ( name ) {
						if ( _MODULE_Bucket[name].module.length <= 1 ) {
							return _MODULE_Bucket[name].module[0].call( Sow );
						}
						// In-case Extend Namespace
						let modules = {}, cache = {}, entry = [];

						for ( let i = 0, l = _MODULE_Bucket[name].module.length; i < l; i++ ) {

							if ( typeof ( _MODULE_Bucket[name].module[i] ) !== 'function' )
								throw new Error( String.format( 'Invalid method defined in Namespace==> `{0}`...', name ) );

							let m = _MODULE_Bucket[name].module[i].call( Sow );

							if ( !( m instanceof [].constructor ) )
								throw new Error( String.format( 'Invalid Namespace==> `{0}` Entry defined..', name ) );

							if ( !( m[0] instanceof {}.constructor ) )
								throw new Error( String.format( 'Invalid Namespace==> `{0}` module defined..', name ) );

							if ( !( m[1] instanceof {}.constructor ) )
								throw new Error( String.format( 'Invalid Namespace==> `{0}` cache defined..', name ) );

							if ( !( m[2] instanceof [].constructor ) )
								throw new Error( String.format( 'Invalid Namespace==> `{0}` entry defined..', name ) );
							//Object.extend( modules, m[0] );//module

							for ( let mo in m[0] ) {

								if ( !( m[0][mo] instanceof [].constructor ) )
									throw new Error( String.format( 'Invalid Namespace==> `{0}` module defined..', name ) );

								if ( modules[mo] )
									throw new Error( String.format( 'This module ==>{0} already exists in Namespace==> `{1}`..', mo, name ) );
								modules[mo] = m[0][mo];
							}
							//Object.extend( cache, m[1] );//cache
							for ( let co in m[1] ) {
								if ( cache[co] )
									throw new Error( String.format( 'This cache ==>{0} already exists in Namespace==> `{1}`..', co, name ) );
								if ( !modules[co] )
									throw new Error( String.format( 'This cache ==>{0} doesn\'t exist in Namespace==> `{1}`..', co, name ) );

								cache[co] = m[1][co];
							}
							//entry
							for ( let j = 0, jl = m[2].length; j < jl; j++ ) {
								let key = m[2][j];
								if ( !modules[key] )
									throw new Error( String.format( 'This entry ==>{0} doesn\'t exist in Namespace==> `{1}`..', key, name ) );

								if ( entry.indexOf( key ) > -1 )
									throw new Error( String.format( 'This entry ==>{0} aleready exist in Namespace==> `{1}`..', key, name ) );

								entry.push( key );
							}
						}
						///let module = [modules, cache, entry];
						//modules = cache = entry = undefined;
						return [modules, cache, entry];
					},
					reRegisterNamespace: function ( s ) {
						let modules = this.export( s.namespace, s.isExport, true );
						if ( s.isExtend ) {
							_MODULE_.blueprint.extendNamespace( s.extNamespace, s.namespace, modules[1], modules[3] );
							return;
						}
						_MODULE_.blueprint.reRegisterNamespace( s.namespace, modules[1], modules[3] );
						return this;
					},
					export: function ( name, isExport, isReRegister ) {

						if ( typeof ( name ) !== 'string' )
							throw new Error( String.format( 'This Namespace==> `{0}` doesn\'t exist...', name ) );

						if ( typeof ( _MODULE_Bucket[name] ) !== 'function' ) {

							if ( typeof ( _MODULE_Bucket[name] ) !== 'object' )
								throw new Error( String.format( 'This Namespace==> `{0}` doesn\'t exist..', name ) );

							if ( !( _MODULE_Bucket[name].module instanceof [].constructor ) )
								throw new Error( String.format( 'This Namespace==> `{0}` doesn\'t exist..', name ) );

							if ( isReRegister )
								return this.getModule( isExport, _MODULE_Bucket[name].settings, this.initializeModule( name ) );

							return _MODULE_.blueprint.initialize.apply( { Object: undefined },
								Array.prototype.slice.call( this.getModule( isExport, _MODULE_Bucket[name].settings, this.initializeModule( name ) ) )
							);
						}
						return _MODULE_.blueprint.initialize.apply( { Object: undefined }, Array.prototype.slice.call( _MODULE_Bucket[name].call( this ) ) );
						//return _MODULE_.blueprint.initialize.apply({ Object: undefined }, Array.prototype.slice.call(_MODULE_Bucket[name].call(this)));
					}
				}
			} );
			//registerNamespace();
			//usingNamespace();
			//exportNamespace();
			// V2
			// Create On Feb 21, 2018
			return CREATE.aggregate( function () {
				CREATE = undefined;
				var Namespace = {};
				return {
					registerNamespace: function ( namespaceName, modules ) {
						if ( typeof ( namespaceName ) !== 'string' )
							throw new Error( "Namespace Name string type required... :(" );

						let extend = false; let child;

						if ( typeof ( Namespace[namespaceName] ) === 'string' ) {
							child = namespaceName; extend = true;
							namespaceName = Namespace[child];
						}
						if ( extend === true ) {
							if ( typeof ( Namespace[namespaceName] ) !== 'object' )
								throw new Error( String.format( 'This Parent Namespace==> `{0}` and Child ==> {1} doesn\'t exist..', namespaceName, child ) );

							if ( Namespace[namespaceName].isInitialize === true )
								throw new Error( String.format( 'You should not extend Prent Namespace==> `{0}` and Child ==> {1} after Initialize..', namespaceName, child ) );

							_REGISTRY_.function( { path: namespaceName, isClass: false }, modules, extend )
								.function( { path: child, isClass: false }, modules, false );
							return this;
						}
						if ( typeof ( Namespace[namespaceName] ) === 'object' )
							throw new Error( String.format( "This Namespace==> `{0}` already exists. You may extend this namespace or try another!!! :)", namespaceName ) );

						if ( typeof ( modules ) !== 'function' )
							throw new Error( "Module Function type required... :(" );

						Namespace[namespaceName] = {
							register: true,
							isInitialize: false,
							unload: false,
							use: 0,
							export: 0
						};
						_REGISTRY_.function( { path: namespaceName, isClass: false }, modules, extend );
						return this;
					},
					mapNamespace: function ( parent, child ) {
						if ( typeof ( parent ) !== 'string' )
							throw new Error( "Parent Namespace required!!!" );

						if ( typeof ( Namespace[parent] ) !== 'object' )
							throw new Error( String.format( 'This parent Namespace==> `{0}` doesn\'t exist.. Child Namespace', parent ) );

						let isArray = false;
						if ( typeof ( child ) !== 'string' ) {
							if ( !( child instanceof [].constructor ) )
								throw new Error( "Child Namespace required !!!" );
							isArray = true;
						}
						if ( !isArray )
							if ( typeof ( Namespace[child] ) === 'object' )
								console.log( String.format( "This Child Namespace==> `{0}` already exists. We are trying to extend ==>{1}==>{2}!!! :)", child, child, parent ) );


						if ( !isArray ) {
							Namespace[child] = parent;
							return this;
						}
						for ( let i = 0, l = child.length; i < l; i++ ) {
							if ( typeof ( Namespace[child[i]] ) === 'object' )
								console.log( String.format( "This Child Namespace==> `{0}` already exists. We are trying to extend ==>{1}==>{2}!!! :)", child[i], child[i], parent ) );

							Namespace[child[i]] = parent;
						}
						return this;
					},
					reRegisterNamespace: function ( namespaceName ) {
						let isExtended = false; let extNamespace;
						if ( typeof ( Namespace[namespaceName] ) === 'string' ) {
							extNamespace = Namespace[namespaceName]; isExtended = true;
						}
						_REGISTRY_.reRegisterNamespace( {
							isExtend: isExtended,
							isExport: true,
							extNamespace: extNamespace,
							namespace: namespaceName
						} );
						return this;
					},
					removeRegistry: function ( namespaceName ) {
						_REGISTRY_.remove( namespaceName );
						return this;
					},
					usingNamespace: function ( namespaceName, removeRegistry ) {
						let isExtended = false; let child;
						if ( typeof ( Namespace[namespaceName] ) === 'string' ) {
							child = namespaceName; isExtended = true;
							namespaceName = Namespace[namespaceName];
						}

						if ( typeof ( Namespace[namespaceName] ) !== 'object' )
							throw new Error( String.format( "This Namespace==> `{0}` is not registerd yet!!! :(", ( isExtended ? child : namespaceName ) ) );

						if ( Namespace[namespaceName].unload === true )
							throw new Error( String.format( "This Namespace==> `{0}` already unloaded!!! :)", ( isExtended ? child : namespaceName ) ) );

						Namespace[namespaceName].use++;

						if ( Namespace[namespaceName].isInitialize ) {
							console.log( String.format( "This Namespace==> `{0}` used total ==> {1}!!! :)", ( isExtended ? child : namespaceName ), Namespace[namespaceName].use ) );
							return this;
						}
						_REGISTRY_.export( namespaceName, false );
						Namespace[namespaceName].isInitialize = true;

						if ( removeRegistry === true )
							_REGISTRY_.remove( namespaceName );

						return this;
					},
					exportNamespace: function ( namespaceName ) {
						let isExtended = false; let child;
						if ( typeof ( Namespace[namespaceName] ) === 'string' ) {
							child = namespaceName; isExtended = true;
							namespaceName = Namespace[namespaceName];
						}

						if ( typeof ( Namespace[namespaceName] ) !== 'object' )
							throw new Error( String.format( "This Namespace==> `{0}` is not registerd yet!!! :(", ( isExtended ? child : namespaceName ) ) );

						if ( Namespace[namespaceName].unload === true )
							throw new Error( String.format( "This Namespace==> `{0}` already unloaded!!! :)", ( isExtended ? child : namespaceName ) ) );

						if ( !Namespace[namespaceName].isInitialize )
							this.usingNamespace( namespaceName );

						Namespace[namespaceName].export++;
						console.log( String.format( "This Namespace==> `{0}` exported total ==> {1}!!! :)", ( isExtended ? child : namespaceName ), Namespace[namespaceName].export ) );

						return _MODULE_.blueprint.exportNamespace( namespaceName );
					},
					unloadNamespace: function ( namespaceName ) {
						if ( typeof ( Namespace[namespaceName] ) !== 'object' )
							throw new Error( String.format( "This Namespace==> `{0}` is not registerd yet!!! :(", namespaceName ) );

						if ( Namespace[namespaceName].unload === true ) {
							console.log( String.format( "This Namespace==> `{0}` already unloaded!!! :)", namespaceName ) );
							return this;
						}
						Namespace[namespaceName].unload = true;
						try {
							_MODULE_.blueprint.unloadNamespace( namespaceName );
						} catch ( e ) {
							console.log( e.message );
						}
						return this;
					}
				};
			} );
		} )
		.define( 'Sow', function () {
			return {
				Run: function () {
					typeof ( arguments[0] ) === 'function' ? arguments[0].call( this ) : undefined;
					return this;
				},
				onRouterChange: function ( event ) {
					console.log( event );
				}
			};
		} ).define( 'Sow.Static', function () {
			var definePoperty = function ( value ) {
				return {
					enumerable: true,
					writable: false,
					configurable: true,
					value: value
				};
			};
			return {
				all: function ( obj ) {
					if ( !( typeof ( obj ) === 'object' || obj instanceof {}.constructor ) )
						throw new Error( "Invalid object defined..." );
					for ( let p in obj ) {
						this.define( obj, p, obj[p] );
					}
					return obj;
				},
				define: function ( obj, poperty, value ) {
					return !( typeof ( obj ) === 'object' || obj instanceof {}.constructor ) ? this
						: ( Object.defineProperty( obj, poperty, definePoperty( value ) ), this );
				},
				change: function ( obj, property, value ) {
					let descriptor;
					return !( typeof ( obj ) !== 'object' || obj instanceof {}.constructor ) ? typeof ( obj )
						: ( descriptor = Object.getOwnPropertyDescriptor( obj, property ), !( typeof ( obj ) !== 'object' || descriptor instanceof {}.constructor ) ? this : ( descriptor.value = value, Object.defineProperty( obj, property, descriptor ), this ) );
				}
			};
		} ).define( 'Sow.Async', function () {
			var private_worker = {
				initiate: function ( t ) {
					if ( !( 'Promise' in window ) ) {
						return {
							then: function ( resolve ) {
								setTimeout( resolve, t );
							},
							catch: function () { }
						};
					}
					return new window.Promise( function ( resolve ) {
						setTimeout( resolve, t ); return;
					} );
				},
				awaitExecute: function ( func, delay, args ) {
					return private_worker.initiate( delay ).then( function () {
						func.apply( { Object: undefined }, Array.prototype.slice.call( args, 0 ) );
						return;
					}, function ( s ) {
						console.log( s );
					} ).catch( function ( reason ) {
						console.log( 'Error Message: ' + reason.message + '\r\nHandle rejected promise (' + reason.stack + ') here.' );
					} );
				},
				executeAsync: function executeAsync( func, delay, args ) {
					if ( typeof ( func ) !== 'function' ) {
						console.error( 'Invalid function define in webcontrol.instance.executeAsync...! \r\n Function type ' + typeof func + '; \r\n Caller is `' + arguments.callee.caller.name + '`\r\n..' + arguments.callee.caller.toString() );
					}
					typeof ( delay ) !== 'number' ? ( delay = 0 ) : delay < 0 ? ( delay = 0 ) : '';
					if ( !args ) {
						if ( Sow.browser.Promise.support ) {
							private_worker.initiate( delay ).then( func, function ( s ) {
								console.warn( s );
							} ).catch( function ( reason ) {
								console.log( 'Error Message: ' + reason.message + '\r\nHandle rejected promise (' + reason.stack + ') here.' );
							} );
						} else {
							setTimeout( func, delay );
						}
						return { executeAsync: this.executeAsync };
					}
					if ( args !== null && typeof ( args ) === 'object' ) {
						if ( Sow.browser.Promise.support ) {
							private_worker.initiate( delay ).then( function () {
								if ( typeof ( args[0] ) !== 'object' ) {
									func.apply( { Object: undefined }, args );
									return { executeAsync: this.executeAsync };
								}
								func.apply( args[0], Array.prototype.slice.call( args, 1 ) ); return;
							}, function ( s ) {
								console.warn( s );
							} ).catch( function ( reason ) {
								console.log( 'Error Message: ' + reason.message + '\r\nHandle rejected promise (' + reason.stack + ') here.' );
							} );
							return {
								executeAsync: this.executeAsync
							};
						}
						setTimeout( function () {
							if ( typeof ( args[0] ) !== 'object' ) {
								func.apply( { Object: undefined }, args );
								return { executeAsync: this.executeAsync };
							}
							func.apply( args[0], Array.prototype.slice.call( args, 1 ) ); return;
						}, delay );
						return {
							executeAsync: this.executeAsync
						};
					}
					throw new Error( 'Invalid args define in webcontrol.instance.executeAsync...! \r\n Arguments type ' + typeof ( args ) + '; ' );
				}
			};
			return {
				execute: private_worker.executeAsync,
				awaitExecute: private_worker.awaitExecute
			};
		} ).define( 'Sow', function () {
			function isMobile() {
				/** Whether we are using a Mobile or not. */
				var a = navigator.userAgent || navigator.vendor || window.opera;
				if ( /android|avantgo|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test( a ) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|e\-|e\/|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(di|rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|xda(\-|2|g)|yas\-|your|zeto|zte\-/i.test( a.substr( 0, 4 ) ) ) {
					return true;
				}
				return false;
			};
			return {
				/** Define Operating System*/
				OS:/** Whether we are using a Mobile or not. */
				isMobile()
					? 'Mobile'
					/** Whether this is on the Windows platform or not. */
					: ( /Win/.test( navigator.platform ) )
						? 'Windows'
						/** Whether we are using a Mac or not. */
						: ( /Mac/.test( navigator.platform ) )
							? 'Mac'
							/** Whether this is on ChromeOS. */
							: ( /CrOS/.test( navigator.userAgent ) )
								? 'ChromeOS'
								/** Whether this is on vanilla Linux. */
								: ( /Linux/.test( navigator.userAgent ) )
									? 'Linux'
									/** Whether this is on Android. */
									: ( /Android/.test( navigator.userAgent ) )
										? 'Android'
										: undefined
			};
		} ).define( 'Sow.Device', function () {
			/** Export*/
			return {
				/** Define Device*/
				isTouchDevice: "ontouchstart" in window,
				deviceType: function () {
					var a = navigator.userAgent.match( /iPhone|iPod|iPad/i );
					return a ? a[0] : "other"
				}.apply( this )
			};
		} ).define( 'Sow.browser.blob', function () {
			var array, support, jpeg, bb;
			support = true;
			try {
				if ( typeof ( window.Blob ) === 'function' ) {
					return {
						support: true
					}
				}
				array = new Int8Array( [17, -45.3] );
				jpeg = new Blob( [array], { type: "image/jpeg" } );
			}
			catch ( e ) {
				// TypeError old chrome and FF
				window.BlobBuilder = window.BlobBuilder || window.WebKitBlobBuilder || window.MozBlobBuilder || window.MSBlobBuilder;
				if ( e.name === 'TypeError' && window.BlobBuilder ) {
					bb = new BlobBuilder();
					bb.append( array.buffer );
					jpeg = bb.getBlob( "image/jpeg" );
				}
				else if ( e.name === "InvalidStateError" ) {
					// InvalidStateError (tested on FF13 WinXP)
					jpeg = new Blob( [array.buffer], { type: "image/jpeg" } );
				}
				else {
					support = false;
					// We're screwed, blob constructor unsupported entirely   
				}
			}
			array = jpeg = bb = '';
			return {
				support: support
			}
		} ).define( 'Sow.browser.Promise', function () {
			let support = true;
			if ( typeof ( Promise ) !== 'function' && Promise.toString().indexOf( "[native code]" ) >= -1 ) {
				support = false;
			}
			return {
				support: support
			}
		} )
		/** Define Sow.dom*/
		.define( 'Sow.dom', function () {
			/** Dom Export*/
			let dom = {
				/** Is High Density*/
				isHighDensity: function () {
					return window.matchMedia && ( window.matchMedia( "only screen and (min-resolution: 124dpi), only screen and (min-resolution: 1.3dppx), only screen and (min-resolution: 48.8dpcm)" ).matches || window.matchMedia( "only screen and (-webkit-min-device-pixel-ratio: 1.3), only screen and (-o-min-device-pixel-ratio: 2.6/2), only screen and (min--moz-device-pixel-ratio: 1.3), only screen and (min-device-pixel-ratio: 1.3)" ).matches ) || window.devicePixelRatio && window.devicePixelRatio > 1.3;
				}(),
				/** Is Retina*/
				isRetina: function () {
					return ( window.matchMedia && ( window.matchMedia( "only screen and (min-resolution: 192dpi), only screen and (min-resolution: 2dppx), only screen and (min-resolution: 75.6dpcm)" ).matches || window.matchMedia( "only screen and (-webkit-min-device-pixel-ratio: 2), only screen and (-o-min-device-pixel-ratio: 2/1), only screen and (min--moz-device-pixel-ratio: 2), only screen and (min-device-pixel-ratio: 2)" ).matches ) || window.devicePixelRatio && window.devicePixelRatio > 2 ) && /(iPad|iPhone|iPod)/g.test( navigator.userAgent );
				}(),
				/** Is Smart Phone*/
				isSmartPhone: function () {
					return window.matchMedia && window.matchMedia( " only screen and (min-device-width : 320px) and (max-device-width : 480px)" ).matches || /(iPhone|iPod)/g.test( navigator.userAgent );
				}(),
				/** Is Tablet*/
				isTablet: function () {
					return window.matchMedia && window.matchMedia( " only screen and (min-device-width : 768px) and (max-device-width : 1024px)" ).matches || /(iPhone|iPod)/g.test( navigator.userAgent );
				}()
			};
			/** Is Desktop*/
			dom.isDesktop = function () {
				return !( this.isTablet || this.isSmartPhone )
			}.call( dom );

			/** Export*/
			return dom;
		} ).define( 'Sow.browser', function () {
			let a = window, b = document, e, f, rt2, len,
				browser = {
					dom: function () {
						var dom = {}; b.getElementById ? 1 : !1, dom && ( ( b.importNode ? 0 : 1 ) || ( dom = 2 ), ( b.normalizeDocument ? 0 : 1 ) || ( dom = 3 ) )
						return dom;
					}(),
					compatibility: {
						lineClamp: function () {
							return "undefined" != typeof ( b.createElement( "div" ).style.webkitLineClamp )
						}(),
						cssTransforms: function () {
							for ( var a = b.createElement( "div" ), c = ["transformProperty", "WebkitTransform", "MozTransform", "OTransform", "msTransform"], d = 0; d < c.length; d++ )
								if ( "undefined" != typeof ( a.style[c[d]] ) ) return !0;
							return !1
						}()
					},
					/** Browser Worker Thread*/
					workerThread: {
						/** Is Browser Support Worker Thread*/
						support: typeof ( window.Worker ) !== undefined ? true : false,
						/** Check Worker Type**/
						receiveType: typeof ( window.Worker ) !== undefined ? 'object' : 'INVALID'
					},
					/** Define Browser Type*/
					type:/** Whether we are using a IE Browser or not. */
					typeof ( window.attachEvent ) === 'function' && !( Object.prototype.toString.call( window.opera ) == '[object Opera]' )
						? 'IE'
						/** Whether we are using a Opera Browser or not. */
						: ( Object.prototype.toString.call( window.opera ) == '[object Opera]' || navigator.userAgent.indexOf( 'Opera Mini' ) > -1 )
							? 'Opera'
							/** Whether we are using a WebKit Type Browser or not. */
							: ( navigator.userAgent.indexOf( 'AppleWebKit/' ) > -1 )
								? 'WebKit'
								/** Whether we are using a Gecko Type Browser or not. */
								: ( navigator.userAgent.indexOf( 'Gecko' ) > -1 && navigator.userAgent.indexOf( 'KHTML' ) === -1 )
									? 'Gecko'
									/** Whether we are using a Apple Browser or not. */
									: ( /Apple.*Mobile/.test( navigator.userAgent ) )
										? 'MobileSafari'
										: undefined
				};
			rt2 = {
				info: function () {
					let chrome, firefox, ie, _opera, safari, webkit;
					_opera = a.opera ? 9 : !1;
					if ( _opera && ( ( navigator.geolocation ? 0 : 1 ) || ( _opera = 10 ), ( a.opera.version ? 0 : 1 ) || ( _opera = parseFloat( a.opera.version() ) ) ), ie = function () { return navigator.userAgent.match( /Trident/ ) && /rv:11.0/i.test( navigator.userAgent ) ? 11 : "object" != typeof b.all || _opera ? !1 : "CSS1Compat" != b.compatMode ? 6 : a.XMLHttpRequest ? Object.defineProperty ? "object" != typeof DOMImplementation || "function" != typeof DOMImplementation.prototype.createDocument ? 8 : a.msMatchMedia ? 10 : 9 : 7 : 6 }(), webkit = ( a.openDatabase ? !0 : !1 ) && !_opera, chrome = webkit && a.chrome ? !0 : !1, safari = webkit && !chrome, safari && ( ( b.compareDocumentPosition ? 0 : 1 ) || ( safari = 4 ), ( navigator.registerContentHandler ? 0 : 1 ) || ( safari = 5 ), ( a.matchMedia ? 0 : 1 ) || ( safari = 6 ) ), firefox = !!navigator.userAgent.match( /firefox/i ), firefox ) {
						try {
							"function" == typeof ( b.createElement( "canvas" ).getContext ) && ( firefox = 1.5 )
						} catch ( d ) { }

						"object" == typeof ( a.globalStorage ) && ( firefox = 2 ), ( b.elementFromPoint ? 0 : 1 ) || ( firefox = 3 ), ( b.querySelector ? 0 : 1 ) || ( firefox = 3.5 ), ( b.getElementsByTagName( "head" )[0].mozMatchesSelector ? 0 : 1 ) || ( firefox = 3.6 ), ( a.Uint8Array ? 0 : 1 ) || ( firefox = 4 ), ( Function.prototype.isGenerator ? 0 : 1 ) || ( firefox = 5 ), ( a.matchMedia ? 0 : 1 ) || ( firefox = 6 ), ( a.FileReader && a.FileReader.prototype.readAsArrayBuffer ? 0 : 1 ) || ( firefox = 7 ), ( b.head && b.head.insertAdjacentHTML ? 0 : 1 ) || ( firefox = 8 )
					}
					chrome ? this.chrome = chrome : '' || firefox ? this.firefox = firefox : '' || ie ? this.ie = ie : '' || _opera ? this.opera = _opera : '' || webkit ? this.webkit = webkit : '' || safari ? this.safari = safari : '';
					return { chrome: chrome, firefox: firefox, ie: ie, opera: _opera, webkit: webkit, safari: safari }
				}.call( browser )
			};
			a = undefined; b = undefined;
			for ( e = ["firefox", "webkit", "chrome", "safari", "khtml", "ie", "opera"], len = e.length, f = 0; f < len; f++ ) {
				if ( browser[e[f]] !== false && browser[e[f]] ) {
					! function ( x, y ) {
						x[y + "Upto"] = function ( a ) {
							return this[x] && ( "number" != typeof ( this[x] ) || this[x] <= a )
						}, x[y + "Atleast"] = function ( a ) {
							return this[x] && ( "number" != typeof ( this[x] ) || this[x] >= a )
						}
					}( browser, e[f] );
					break;
				}
			};
			e = undefined;
			/** Define Browser Version*/
			browser.version = function ( x ) {
				let ua; ua = navigator.userAgent;
				return this.type === 'Gecko' ? /** Whether this browser type is Gecko*/function ( a, b ) {
					let rv = -1, re = new RegExp( "rv:([0-9]{1,}[\.0-9]{0,})" );
					re.exec( ua ) !== null ? rv = parseFloat( RegExp.$1 ) : '';
					if ( b.firefox !== false && ua.indexOf( 'Firefox/' ) > 0 ) { a.name = 'Firefox'; return rv; }
					if ( b.ie !== false && ua.indexOf( 'Trident/' ) > 0 ) {/** IE > 10*/a.name = 'IE'; return rv; }
					return rv;
				}( this, x ) : this.type === 'WebKit' ?/** Whether this browser type is WebKit*/ function ( a, b ) {
					let rv = -1, re;
					if ( b.opera ) { re = ua.match( /Opera|OPR\/([0-9]+)\./ ); return re ? ( rv = parseInt( re[1], 10 ), a.name = 'Opera', rv ) : ''; }
					if ( b.chrome ) { re = ua.match( /Chrom(e|ium)\/([0-9]+)\./ ); return re ? ( rv = parseInt( re[2], 10 ), a.name = 'Chrome', rv ) : rv; }
					if ( b.safari ) { re = /AppleWebKit\/([\d.]+)/.exec( navigator.userAgent ); return re ? ( rv = parseFloat( re[1] ), a.name = 'Safari', rv ) : rv; }
					return rv;
				}( this, x ) : this.type === 'IE' ?/** Whether this browser type is IE (IE version < 9)*/ function ( a, b ) {
					let rv = -1, re;
					if ( b.ie ) { re = new RegExp( "MSIE ([0-9]{1,}[\.0-9]{0,})" ); return re.exec( ua ) !== null ? ( rv = parseFloat( RegExp.$1 ), a.name = 'IE', rv ) : rv; }
					return rv;
				}( this, x ) : this.type === 'Opera' ?/** Whether this browser type is Opera*/ function ( a, b ) {
					let rv = -1, re;
					if ( b.opera ) { try { rv = navigator.userAgent.match( /Version\/([1-9]+\.[0-9]{2})/ )[1]; a.name = 'Opera'; return rv; } catch ( ex ) { return rv; } }
				}( this, x ) : /** Undefined browser type define*/ -1;
			}.call( browser, rt2.info );
			/** Whether this browser version is support or not*/
			browser.support = function support( options ) {
				let key, keys, shiftObj = options, bn, OS, i, isSupport = false; options = {};
				if ( typeof ( shiftObj ) !== 'object' ) { return; }
				for ( i in shiftObj ) {
					if ( !i ) continue;
					key = i; key = key.toLowerCase();
					options[key] = {};
					typeof ( shiftObj[i] ) === 'object' ? function () {
						for ( var j in shiftObj[i] ) {
							if ( !j ) continue;
							keys = j;
							keys = keys.toLowerCase();
							options[key][keys] = shiftObj[i][j];
						}
					}.call( { Object: undefined } ) : undefined;
				};
				shiftObj = undefined;
				OS = Sow.OS ? ( Sow.OS ).toLowerCase() : undefined;
				bn = this.name ? ( this.name ).toLowerCase() : '';
				this.required_version = options[OS][bn] ? options[OS][bn] : this.version;
				return !OS ? function () {
					return false;
				}() : !bn ? function () {
					return false;
				}() : function () {
					var msg = 'This application will not work properly in this browser. Please update your browser. Current browser information- ' + 'Name :' + this.name + '; Version: ' + this.version + '; Type: ' + this.type + '; OS :' + Sow.OS + '. Required virsion minimum ' + this.required_version + '.';
					return options[OS] && !options[OS][bn] ? ( this.support = true, { status: true } ) : this.version >= options[OS][bn] ? ( this.support = true, { status: true } ) : ( this.support = false, { status: false, msg: msg } );
				}.call( this/** Function inheritance*/ );
			};
			/** Export*/
			return function () {
				var s = browser; browser = rt2 = undefined;
				return s;
			}();
		} );

	try {
		// WebKit returns null on unsupported types
		if ( ( new DOMParser() ).parseFromString( "", "text/html" ) ) {
			// text/html parsing is natively supported
		}
	} catch ( ex ) {
		console.warn( ex.message );
		Sow.define( '', function () {
			var proto;
			if ( typeof ( window.DOMParser ) === 'function' ) {
				proto = DOMParser.prototyp;
				nativeParse = proto.parseFromString;
				if ( typeof ( nativeParse ) !== 'function' ) {
					nativeParse = function ( markup, type ) {
						throw new Error( 'Not Supported! :(' );
					}
				}
			};
			return {
				DOMParser: ( new this.Assembler() ).Create.Class( function () {
					return {
						constructor: function () {
							/**[Constructor Body]*/
						},
						parseFromString: function ( markup, type ) {
							if ( /^\s*text\/html\s*(?:;|$)/i.test( type ) ) {
								var
									doc = document.implementation.createHTMLDocument( "" )
									;
								if ( markup.toLowerCase().indexOf( '<!doctype' ) > -1 ) {
									doc.documentElement.innerHTML = markup;
								}
								else {
									doc.body.innerHTML = markup;
								}
								return doc;
							} else {
								return nativeParse.apply( this, arguments );
							}
						}
					}
				} )
			};
		} );
	};
} ) );
