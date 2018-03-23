Sow.registerNamespace(/**[settings]*/'Sow.Net.Web', function () {
	const HUBNAME = 'manager';
	return /**[modules]*/[{
		1: [function ( require, module, exports ) {
			//Sow.unloadNamespace('Sow.Net.SignalR');
			return module.aggregate( function () {
				return {
					ready: function () {
						require( 'Sow.Net.Route' ).onLoad( "Get Ready!!!" );
						return;
					},
					initialize: function ( requireSignalR ) {
						if ( requireSignalR ) {
							require( 'Sow.Net.SignalR' ).init();
						}
						require( 'Sow.Net.Route' ).onLoad();
						$( document ).on( 'ready', function () {
							try {
								require( 'Sow.Net.Route' ).ready( "Get Ready!!!" );
							} catch ( e ) {
								throw new Error( "No such page namespace registerd yet. Please at first register your page." );
							}
						} );
					}
				};
			} );
		}, {
			'Sow.Net.SignalR': 2,
			'Sow.Net.Route': 6,
			owner: 'Page.Manager',
			public: true
		}],
		// MODEL
		2: [function ( require, module, exports ) {
			var _SIGNALR = {};
			var _SETTINGS = {
				pingInterval: 300000,
				waitForPageLoad: true,
				jsonp: false,
				withCredentials: true,
				transport: ['webSockets', 'serverSentEvents', 'longPolling']
			};
			return {
				init: function () {
					Sow.usingNamespace( 'Sow.Net.SignalR' );
					_SIGNALR = /**require( '../Web/SignalR' )*/Sow.exportNamespace( 'Sow.Net.SignalR' );
					_SIGNALR.server.initialize( HUBNAME, _SETTINGS, Math.floor( ( 0x2 + Math.random() ) * 0x1000 ), true ).start( function () {
						console.log( arguments );
						let view = require( 'Sow.Net.Web.View' );
						if ( typeof ( view[arguments[0]] ) === 'function' ) {
							view[arguments[0]].apply( view, Array.prototype.slice.call( arguments, 1 ) );
							return;
						}
						return this;
					}, function ( a, b, c ) {
						return this;
					} );
				},
				execute: function ( cb ) {
					_SIGNALR.execute( HUBNAME, cb );
					return this;
				},
				server: {
					restart: function () {
						_SIGNALR.restart( HUBNAME, _SETTINGS, function () { }, function () { } );
						return this;
					},
					stop: function ( cb ) {
						_SIGNALR.stop( HUBNAME, cb );
						return this;
					}
				}
			};
		}, {
			'Sow.Net.Web.View': 5
		}],
		// CONTROLLER
		3: [function ( require, module, exports ) {
			return {
				sginOut: function ( cb ) {
					require( 'Sow.Net.SignalR' ).execute( function ( c ) {
						if ( this.connection.state !== 1 ) {
							console.log( "NOT CONNECTED" );
							require( 'Sow.Net.Web.View' ).redirect();
							return;
						}

						this.server.sginOut( typeof ( cb ) === 'function' ? c.call( this, cb ) : null );
					} );
					return this;
				}
			};
		}, {
			'Sow.Net.SignalR': 2,
			'Sow.Net.Web.View': 5
		}],
		// DATA
		4: [function ( require, module, exports ) {
			return {
				a: function ( i ) {
					console.log( i );
				},
				b: function ( i ) {
					console.log( i );
				}
			};
		}, {}],
		// VIEW
		5: [function ( require, module, exports ) {
			return {
				redirect: function ( a, b ) {
					setTimeout( function () {
						location.href = "/urlroute.aspx?dc=" + a + "&next=" + encodeURI( location.pathname + "#/" + Sow.currentPage() );
					}, 100 );
					return;
				},
				check_db: function ( a, b ) {

				},
				onExecuteIo: function ( a, b, c ) {
					//console.log( a, b, c );
					this[c]( a, b );
				},
				onConnected: function ( a, b, c ) {
					let view = require( 'Sow.Net.Web.View.page' );
					if ( typeof ( view['onConnected'] ) === 'function' ) {
						view['onConnected'].apply( view, Array.prototype.slice.call( arguments, 0 ) );
						return this;
					}
					view = undefined;
					require( 'Sow.Net.SignalR' ).execute( function ( c ) {
						if ( this.connection.state !== 1 ) {
							console.log( "NOT CONNECTED" );
							require( 'Sow.Net.SignalR' ).server.restart();
							return;
						}
						this.server.onTaskEnd( c.call( this, function () {
							console.log( arguments );
						} ), 'Welcome!!!' );
						this.server.executeIo( c.call( this, function () {
							console.log( arguments );
						} ), "client._check", JSON.stringify( { a: 1, b: 2 } ) );
						this.server.getConnectedUserObject( c.call( this, function () {
							console.log( arguments );
						} ) );
						this.server.getTotalConnectedUser( c.call( this, function () {
							console.log( arguments );
						} ) );
					} );
				},
				onTryReConnect: function () {
					if ( typeof ( this[arguments[0]] ) === 'function' ) {
						this[arguments[0]].apply( this, Array.prototype.slice.call( arguments, 1 ) );
					}
					console.log( arguments );
				},
				onSginOut: function ( a, b, c ) {
					var that = this;
					require( 'Sow.Net.SignalR' ).server.stop( function () {
						require( 'Sow.Net.Web.XHR' )
							.sginOut()
							.success( function () {
								that.redirect( Math.floor( ( 0x2 + Math.random() ) * 0x1000 ) );
								that = undefined;
							} )
							.error( function () {
								that.redirect( Math.floor( ( 0x2 + Math.random() ) * 0x1000 ) );
								that = undefined;
							} );
					} );
					return;
				}
			};
		}, { 'Sow.Net.SignalR': 2, 'Sow.Net.Web.Controller': 3, 'Sow.Net.Web.XHR': 7, 'Sow.Net.Web.View.page': 101 }],
		6: [function ( require, module, exports ) {
			var pages = {
				"/pages/dashboard": {
					script: ["/pages/js/dashboard/base.js"],
					css: ["/pages/css/dashboard/base.css"]
				}
			};
			return {
				ready: function ( s ) {
					$( '#__logout' ).click( function () {
						require( 'Sow.Net.Web.Controller' ).sginOut( null );
					} );
					require( 'Sow.Net.Web.View.page' ).ready();
				},
				onLoad: function () {

				}
			};
		}, {
			'Sow.Net.Web.Controller': 3, 'Sow.Net.Web.View.page': 101,
		}],
		/** [XML HTTP REQUEST] */
		7: [function ( require, module, exports ) {
			return module.aggregate( function () {

				return {
					sginOut: function () {
						var request = this.xhr( {
							type: "POST",
							url: "/__sow/__handler/routemanager.ashx?q=SGINOUT"
						} );
						return {
							success: function ( cb ) {
								request.done( function ( data ) {
									request = undefined;
									cb.call( this, data );
								} );
								return this;
							},
							error: function ( cb ) {
								request.fail( function ( jqXHR, textStatus ) {
									request = undefined;
									cb.call( this, jqXHR, textStatus );
								} )
								return this;
							}
						};
					},
					xhr: this.aggregate( function () {
						var xmlWorker = {
							prepareSettings: this.aggregate( function () {
								var defaultSettings = {
									type: "GET",
									url: "/_chief/server/controller/postgreSQL.ashx",
									data: {}, dataType: 'text',
									async: true, cache: false,
									contentType: "application/x-www-form-urlencoded; charset=UTF-8",
									//success: function ( data ) { return; },
									//complete: function ( XHR, textStatus ) { return; },
									beforeSend: function ( xhr ) { return; },
									//error: function ( i, j, k ) { return; },
									//progress: function ( event ) { if ( event.lengthComputable ) { var percentComplete = event.loaded / event.total; return; } },
									//onabort: function ( evt ) { return; },
									xhrFields: { withCredentials: true }
								};
								return function ( s ) {
									let clone = Object.clone( defaultSettings );
									Object.extend( clone, s );
									return clone;
								}
							} )
						};
						return function ( options ) {
							return $.ajax(
								xmlWorker.prepareSettings( options )
							);
						}
					} )
				};
			} );
		}, {
			public: false
		}],
		8: [function ( require, module, exports ) {
			var v_worker = {
				validate: module.aggregate( function () {
					var q_work = {
						trim: function ( s ) {
							if ( !s ) return "";
							if ( s.length === 0 )
								return s;
							return s.replace( /^\s+|\s+$/, '' );
						},
						required: function ( val, key, keyMsg ) {
							if ( val === null || val === undefined || !val )
								return { msg: ( keyMsg ? String.format( "{0} required...", keyMsg ) : "required..." ), error: true };
							return { msg: "", error: false };
						},
						max: function ( val, key ) {
							if ( this.required( key ).error ) return { msg: "", error: false };
							if ( this.required( val ).error ) val = "";
							if ( isNaN( key ) ) return { msg: "", error: false };
							key = parseInt( key );
							if ( val.length > key ) return { msg: String.format( "Maximum {0} characters allowed !!!", key ), error: true };
							return { msg: "", error: false };
						},
						min: function ( val, key ) {
							if ( this.required( key ).error ) return { msg: "", error: false };
							if ( this.required( val ).error ) val = "";
							if ( isNaN( key ) ) return { msg: "", error: false };
							key = parseInt( key );
							if ( val.length < key ) return { msg: String.format( "Minimum {0} characters required !!!", key), error: true };
							return { msg: "", error: false };
						},
						type: this.aggregate( function () {
							var t_work = {
								email: function ( value, key ) {
									if ( /^[\w\-\.\+]+\@[a-zA-Z0-9\.\-]+\.[a-zA-z0-9]{2,4}$/.test( value ) ) {
										return true;
									}
									return false;
								},
								mobile: function ( value, key ) {
									if ( /^\d{11}$/.test( value ) || /^[+]?[88]\d{12}$/.test( value ) || /^[0]?[88]\d{12}$/.test( value ) ) {
										return true;
									}
									return false;
								},
								numeric: function ( val, key ) {
									return /^[0-9 .]+$/.test( val );
								},
								isAlpha: function ( val ) {
									return /^[a-zA-Z]+$/.test( val );
								},
								alphaNumeric: function ( val ) {
									return /^[0-9a-zA-Z]+$/.test( val );
								},
								mixed/*[specialCharacter]*/: function ( val ) {
									return /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/.test( val ) !== true;
								},
							}, message = {
								email: "Email should be the real one!!!",
								mobile: "Mobile number should be the real one!!!",
								numeric: "Numeric required !!!",
								isAlpha: "Alphabet required !!!",
								alphaNumeric: "Alphabet or Numeric required!!!",
								mixed: "Special Character e.g. !@#$%^&*() not allowed!!!"
							};
							return function ( val, key ) {
								if ( this.required( key ).error )
									return { msg: "", error: false };
								if ( typeof ( t_work[key] ) !== 'function' ) 
									return { msg: "", error: false };
								if ( this.required( val ).error ) val = "";
								if ( t_work[key]( val ) )
									return { msg: "", error: false };
								return { msg: message[key], error: true };
							}
						} ),
						pattern: function ( val, key ) {
							if ( this.required( key ).error ) return { msg: "", error: false };
							if ( this.required( val ).error ) val = "";
							let res = val.match( key );
							if ( res )
								return { msg: "", error: false };
							return { msg: "Invalid!!!", error: true };
						},
					};
					return function ( $el, logic, isGroup ) {
						//logic = '@[msg=email;required;pattern=;max=10;min=2;type=email;]';
						$el = v_worker.getInstance( $el );
						if ( q_work.required( logic ).error || typeof ( logic ) !== 'string' ) {
							logic = $el.attr( 'data-logic' );
						}
						if ( !logic ) {
							//Success
							return true;
						}
						logic = String( logic );
						logic = logic.substring( 2, logic.length );
						logic = logic.substring( 0, logic.length - 2 );
						let larr = logic.split( ";" );
						let hasError = false; let wmsg = "", keyMsg = "";
						let val = $el.val();
						for ( let x = 0, l = larr.length; x < l; x++ ) {
							let clogic = larr[x];
							if ( !clogic ) continue;
							let carr = clogic.split( '=' );
							if ( carr[0] === 'msg' ) {
								if ( x > 0 ) throw new Error( "Invalid Positon of Message!!!" + carr[1] );
								keyMsg = carr[1]; continue;
							}
							if ( typeof ( q_work[carr[0]] ) !== 'function' ) {
								throw new TypeError( "Invalid logic defined!!!" + carr[0] );
							}
							resp = q_work[carr[0]]( val, carr[1], keyMsg );
							if ( resp.error ) {
								hasError = true;
								wmsg = resp.msg;
								break;
							}
						}
						if ( hasError ) {
							$el.removeClass( 'ng-valid' )
								.removeClass( 'form-control-success' )
								.addClass( 'ng-invalid form-control-danger' );
							if ( isGroup ) {
								$( '[data-msg_name="' + $el.attr( 'name' ) + '"]' ).removeClass( 'success' ).addClass( 'error' ).html( wmsg );
							} else {
								$el.after( '<small data-type="___msg" class="form-text error"> ' + wmsg + '</small >' );
							}
						} else {
							$el.removeClass( 'ng-invalid' )
								.removeClass('form-control-danger')
								.addClass( 'ng-valid form-control-success' );
						}
						$el = larr = val = undefined;
						return hasError;
					}
				} ),
				reset: function ( $frm, cb, isGroup ) {
					$frm = this.getInstance( $frm );
					Sow.Async.execute( function () {
						let $el = $( '[data-type="___msg"]' );
						$el.each( function () {
							if ( isGroup ) {
								$( this ).removeClass( 'error' ).removeClass( 'success' ).html( '' );
								return;
							}
							$( this ).remove();
							return;
						} );
						$frm.each( function () {
							$( this ).removeClass( 'ng-invalid' )
								.removeClass( 'form-control-danger' )
								.addClass( 'ng-valid form-control-success' );
							return;
						} );
						cb.call( v_worker );
					}, 0 );
					return;
				},
				getInstance: function ( $elm ) {
					if ( $elm === null || $elm === undefined )
						throw new TypeError( "Invalid element defined!!!" );

					if ( ( $elm instanceof $ ) )
						return $elm;
					
					if ( typeof ( $elm ) === 'string' )
						return $( $elm );

					if ( typeof ( $elm ) === 'object' )
						return $( $elm );

					throw new TypeError( "Invalid element defined!!!" );
				}
			};
			return {
				reset: function ( $frm, cb, isGroup ) {
					typeof ( isGroup ) !== 'boolean' ? isGroup = false : undefined;
					var that = this;
					v_worker.reset( $frm, function () {
						cb.call( that ); that = undefined;
					}, isGroup );
					return this;
				},
				keyUp: function ( $elm, cb, keObj, isGroup ) {
					typeof ( isGroup ) !== 'boolean' ? isGroup = false : undefined;
					var hasCb = typeof ( cb ) === 'function';
					var isObject = keObj === null || keObj === undefined ? false : typeof ( keObj ) === 'object';
					Sow.Async.execute( function () {
						$elm = v_worker.getInstance( $elm );
						$elm.on( 'keyup', function ( e ) {
							e.preventDefault();
							var $el = $( this );
							Sow.Async.execute( function () {
								if ( hasCb ) {
									if ( isObject ) {
										let name = $el.attr( 'name' );
										if ( keObj[name] ) {
											cb.call( v_worker, $el, name );
											return;
										}
									} else {
										cb.call( v_worker, $el );
										return;
									}
								}
								if ( isGroup ) {
									$( '[data-msg_name="' + $el.attr( 'name' ) + '"]' ).removeClass( 'success' ).removeClass( 'error' ).html( "" );
								} else {
									$el.next().remove();
								}
								v_worker.validate( $el, undefined, isGroup );
								$el = undefined;
								return;
							}, 0 );
						} );
						$elm = undefined;
						return;
					}, 0 );
					return this;
				},
				validate: function ( $elm, cb, isGroup ) {
					typeof ( isGroup ) !== 'boolean' ? isGroup = false : undefined;
					typeof ( cb ) !== 'function' ? cb = function () { } : undefined;
					Sow.Async.execute( function () {
						$elm = v_worker.getInstance( $elm );
						var outObj = {}; var hasError = false;
						$elm.each( function () {
							let $el = $( this );
							let logic = $el.attr( 'data-logic' );
							if ( !logic ) {
								outObj[$el.attr( 'name' )] = $el.val();
								return;
							}
							if ( v_worker.validate( $el, logic, isGroup ) ) {
								hasError = true;
								return;
							}
							if ( hasError ) return;
							outObj[$el.attr( 'name' )] = $el.val();
						} );
						cb.call( v_worker, hasError, outObj );
						outObj = undefined;
						return;
					}, 0 );
					return this;
				}
			};
		}, {
			
		}],
	}, {/**[cache]*/ }, /**[entry]*/[2, 1, 3, 4, 5, 6, 7, 8]]
} );
Sow.usingNamespace( 'Sow.Net.SignalR' );// SignalR Core
Sow.usingNamespace( 'Sow.Net.Web' );// Page Demand
//this.exportNamespace( 'Sow.Net.Web.default' ).initialize();
//this.usingPage( 'Sow.Net.Web.default' );
//this.reRegisterNamespace( 'Sow.Net.Web.default' );
Sow.define( "Sow", function () {
	const PARENT_NAMESPACE = 'Sow.Net.Web';
	var PAGE_ROUTE = false;
	var CUR_PAGE = "";
	var START_PAGE = function () {
		let page = location.href.split( '#' )[1];
		if ( !page ) return '/pages/dashboard';
		return page;
	}();
	/*[Export]*/
	return {
		mapPageNamespace: function ( arr ) {
			if ( this.isArrayLike( arr ) ) {
				return Sow.mapNamespace( PARENT_NAMESPACE, arr );
			}
			if ( typeof ( PAGE_ROUTE ) !== 'boolean' ) return;
			PAGE_ROUTE = function () {
				let outObj = {},
					d = {
						"/pages/charts/chartist-js": "Sow.Net.Web.default",
						"/pages/dashboard": "Sow.Net.Web.default",
						"/pages/components/treeview": "Sow.Net.Web.default"
					},
					namespace = [];
				for ( let x in d ) {
					outObj[x] = { is_viewed: false, namespace: d[x] };
					namespace.push( d[x] );
				}
				Sow.mapNamespace( PARENT_NAMESPACE, namespace );
				return outObj;
			}( this );
			return this;
		},
		currentPage: function () {
			return CUR_PAGE;
		},
		getQuery: function () {
			var uriObj = {
				full: "",
				keys: {

				}
			};
			[function () {
				let uri, lUri, oUri, i, col, oCol;
				uri = window.location.href;
				lUri = uri.toLowerCase().split( '?' );
				if ( !lUri[1] ) return;
				oUri = uri.split( '?' );
				uriObj.full = oUri[1];
				lUri = lUri[1].split( '&' );
				oUri = oUri[1].split( '&' );
				uri = undefined;
				i = lUri.length;
				while ( i-- ) {
					if ( !lUri[i] ) continue;
					col = lUri[i].split( '=' );
					if ( col.length <= 0 ) continue;
					oCol = oUri[i].split( '=' );
					uriObj.keys[col[0]] = oCol[1];
				}
				uri = lUri = oUri = i = col = oCol = undefined;
				return;
			}.call( this )];

			return function ( key ) {
				if ( !key ) return uriObj;
				if ( key === 'full' ) return uriObj.full;
				return uriObj.keys[key];
			};
		}.call( this ),
		onRouterChange: function ( event, route ) {
			var isStart = false;
			if ( Object.keys( event ).length > 2 ) {
				if ( !CUR_PAGE ) return;
				if ( !event.url === START_PAGE ) {
					return;
				}
				START_PAGE = undefined;
				isStart = true;
			}
			if ( typeof ( PAGE_ROUTE ) === 'boolean' ) {
				Sow.mapPageNamespace();
			};
			CUR_PAGE = event.url;
			if ( typeof ( PAGE_ROUTE[CUR_PAGE] ) !== 'object' ) {
				//throw new Error( String.format( "Invalid page route defind===>{0}", event.url ) );
				return;
			}

			let namespace = PAGE_ROUTE[CUR_PAGE].namespace;
			console.log( String.format( "Prepare namespace ===>{0}", namespace ) );
			Sow.reRegisterNamespace( namespace );
			if ( isStart ) {
				Sow.exportNamespace( namespace ).initialize();
				return;
			}
			Sow.exportNamespace( namespace ).ready();
			return;
		}
	};
} ).define( "Sow", function () {
	return {
		Web: {
			userInfo: function ( obj ) {
				if ( typeof ( obj ) !== 'object' )
					throw new Error( "Invalid Object defined!!! :(" );
				this.userInfo = Sow.Static.all( obj );
				return this;
			}
		}
	};
} );
//{id: 5, url: "/pages/charts/chartist-js"}
