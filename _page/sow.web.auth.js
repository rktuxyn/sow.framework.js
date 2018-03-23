Sow.usingNamespace( 'Sow.Net.Web' )
	.registerNamespace(/**[settings]*/'Sow.Net.Web.Auth.Login', function () {
		return /**[modules]*/[{
			//[Extend VIEW]
			100: [function ( require, module, exports ) {

				return module.aggregate( function () {
					return {
						onExecuteIo: function ( a, b, c ) {
							if ( typeof ( this[c] ) === 'function' )
								this[c]( a, b );
						},
					};
				} );

			}, {
				isExtend: true,
				ext_key: 5
			}],
			//[/Extend VIEW]
			101: [function ( require, module, exports ) {

				return module.aggregate( function () {
					return {
						ready: function ( a ) {
							require( 'Sow.Net.Web.XHR' ).xhr( {
								type: "get",
								url: "/__sow/__handler/routemanager.ashx?q=SGINOUT",
								dataType: 'json',
								xhrFields: { withCredentials: true }
							} ).done( function ( data ) {
								require( 'Sow.Net.Web.Validate' ).keyUp( $( 'form input[data-type="text"]' ), undefined, undefined, true );
								var _MSG = {
									"-101": ["email"],
									"-102": ["password"],
									"-103": ['email', 'Invalid @User ! Or <a href="/auth/forgotpassword.aspx">Forgot @User !</a> !'],
									"-104": ['password', 'Password don\'t match with @User...! Or <a href="/auth/forgotpassword.aspx">Forgot !</a>'],
									"103": ['email', 'This @User Exists Our System !']
								}, _next = function () {
									let next = Sow.getQuery( 'next' );
									if ( !next )
										location.href = next;
									location.href = "/urlroute.aspx";
									return;
								};

								$( 'form button' ).on( 'click', function ( e ) {
									var $owner = $( this ), $gmsg = $( '#_g_msg' );
									$owner.attr( 'disabled', true );
									var $frm = $( 'form input[data-type="text"]' );
									require( 'Sow.Net.Web.Validate' ).reset( $frm, function () {
										this.validate( $frm, function ( isErr, obj ) {
											if ( isErr ) {
												$owner.removeAttr( 'disabled' ); $owner = $gmsg = undefined;
												return;
											}
											require( 'Sow.Net.Web.XHR' ).xhr( {
												type: "get",
												url: String.format( "/__sow/__handler/routemanager.ashx?q=SGININ&def={0}", encodeURIComponent( JSON.stringify( obj ) ) ),
												dataType: 'json',
												xhrFields: { withCredentials: true }
											} ).done( function ( data ) {
												$gmsg.html( "" );
												if ( typeof ( data ) === 'string' ) {
													data = JSON.parse( data );
												}
												data.ret_val = parseInt( data.ret_val );
												$owner.removeAttr( 'disabled' ); $owner = undefined;
												if ( data.ret_val === -501 ) {
													$gmsg.html( data.ret_msg ); $gmsg = undefined;
													Sow.Async.execute( function () {
														_next();
													}, 1000 );
													return;
												}
												if ( data.ret_val > 0 ) {
													$gmsg = undefined;
													_next();
												}
												if ( data.ret_val === -1 ) {
													$gmsg.html( data.ret_msg ); $gmsg = undefined;
													return;
												}
												let rv = String( data.ret_val );
												if ( data.ret_val === -550 ) {
													$gmsg = undefined;
													let arr = JSON.parse( data.ret_msg );
													for ( let i = 0, l = arr.length; i < l; i++ ) {
														let karr = _MSG[String( arr[i] )];
														if ( !karr || !Sow.isArrayLike( karr ) ) {
															continue;
														}
														let kv = karr[0];
														$( '[data-msg_name="' + kv + '"]' ).removeClass( 'success' ).addClass( 'error' ).html( karr[1] );
														$( "#" + kv ).removeClass( 'ng-valid' )
															.removeClass( 'form-control-success' )
															.addClass( 'ng-invalid form-control-danger' );
													}
													return;
												}
												let res = _MSG[rv];
												if ( !Sow.isArrayLike( res ) ) {
													$gmsg.html( data.ret_msg ); $gmsg = undefined;
													return;
												}
												$gmsg = undefined;
												let key = res[0];
												$( '[data-msg_name="' + key + '"]' ).removeClass( 'success' ).addClass( 'error' ).html( res[1] || data.ret_msg );
												return;
											} ).fail( function ( jqXHR, textStatus ) {
												console.log( textStatus );
												$owner.removeAttr( 'disabled' );
												$gmsg.html( textStatus ); $owner = $gmsg = undefined;
											} );
										}, true );
										$frm = undefined;
										return;
									}, true );
								} );
							} ).fail( function ( jqXHR, textStatus ) {
								console.log( textStatus ); location.reload( true );
							} );

						}
					};
				} );

			}, {
				'Sow.Net.Web.Controller': 3,
				'Sow.Net.Web.Data': 4,
				'Sow.Net.Web.View': 5,
				'Sow.Net.Web.XHR': 7,
				'Sow.Net.Web.Validate': 8
			}]
		}, {/**[cache]*/ }, /**[entry]*/[100, 101]]
	} ).registerNamespace(/**[settings]*/'Sow.Net.Web.Auth.SginUp', function () {
		return /**[modules]*/[{
			//[Extend VIEW]
			100: [function ( require, module, exports ) {

				return module.aggregate( function () {
					return {
						onExecuteIo: function ( a, b, c ) {
							if ( typeof ( this[c] ) === 'function' )
								this[c]( a, b );
						},
					};
				} );

			}, {
				isExtend: true,
				ext_key: 5
			}],
			//[/Extend VIEW]
			101: [function ( require, module, exports ) {

				return module.aggregate( function () {
					return {
						ready: function ( a ) {
							require( 'Sow.Net.Web.XHR' ).xhr( {
								type: "get",
								url: "/__sow/__handler/routemanager.ashx?q=SGINOUT",
								dataType: 'json',
								xhrFields: { withCredentials: true }
							} ).done( function ( data ) {
								var _MSG = {
									"-101": ["email"],
									"-102": ["password"],
									"-103": ['email', 'Invalid @User ! Or <a href="/auth/forgotpassword.aspx">Forgot @User !</a> !'],
									"-104": ['password', 'Password don\'t match with @User...! Or <a href="/auth/forgotpassword.aspx">Forgot !</a>'],
									"-105": ['re_pass', 'Password does not match the confirm password!!'],
									"-106": ['full_name', 'Full name required!!'],
									"103": ['email', 'This @User Exists Our System !']
								}, _next = function () {
									let next = Sow.getQuery( 'next' );
									if ( !next )
										location.href = next;
									location.href = "/urlroute.aspx";
									return;
								}, _invalidInput = function ( $el, $msg, msg ) {
									$msg.removeClass( 'success' )
										.addClass( 'error' ).html( msg );
									$el.removeClass( 'ng-valid' )
										.removeClass( 'form-control-success' )
										.addClass( 'ng-invalid form-control-danger' );
									$el = $msg = undefined; return;
								};
								module.Closure( function () {
									var $pass = $( '#password[data-type="text"]' );
									var $re = $( '#re_pass[data-type="text"]' );
									var _c_work = {
										password: function ( $el, name ) {
											$( '[data-msg_name="password"]' ).removeClass( 'success' ).removeClass( 'error' ).html( "" );
											if ( this.validate( $el, undefined, true ) ) return;
											_c_work.re_pass.call( this, $re, "re_pass", true );
											return;
										},
										re_pass: function ( $el, name, isIn ) {
											let rval = $el.val();
											if ( isIn === true ) {
												if ( String( rval ).length <= 0 ) return;
											}
											let $inst = $( '[data-msg_name="re_pass"]' );
											$inst.removeClass( 'success' ).removeClass( 'error' ).html( "" );
											if ( this.validate( $el, undefined, true ) ) {
												$inst = undefined; return;
											};
											let pval = $pass.val();

											if ( pval === rval )
												return;
											_invalidInput( $el, $inst, "Password does not match the confirm password!!" );
											$el = $inst = undefined;
											return;
										},
										email: this.aggregate( function () {
											var $ajax = {}, $inst = $( '[data-msg_name="email"]' ),
												setError = function ( msg ) {
													this.removeClass( 'ng-valid' )
														.removeClass( 'form-control-success' )
														.addClass( 'ng-invalid form-control-danger' );
													$inst.removeClass( 'success' ).addClass( 'error' ).html( '<img src="/__sow/images/error.png" /> ' + msg );
													return;
												};

											return function ( $el, name ) {
												if ( typeof ( $ajax.abort ) === 'function' ) {
													$ajax.abort(); $ajax = {};
												}
												$inst.removeClass( 'success' ).removeClass( 'error' ).html( "" );
												if ( this.validate( $el, undefined, true ) ) {
													$el = undefined;
													return;
												};
												let val = $el.val();
												$inst.html( '<img src="/__sow/images/ajax-loading.gif" /> Please wait..! ' );
												$ajax = require( 'Sow.Net.Web.XHR' ).xhr( {
													type: "get",
													url: String.format( "/__sow/__handler/routemanager.ashx?q=key_up&task_type=email&sp=___check__key_up&def={0}", encodeURIComponent( JSON.stringify( { email: val } ) ) ),
													dataType: 'json',
													xhrFields: { withCredentials: true }
												} ).done( function ( data ) {
													$ajax = {};
													if ( typeof ( data ) === 'string' ) {
														data = JSON.parse( data );
													}
													if ( data.ret_val < 0 ) {
														setError.call( $el, data.ret_msg );
														$el = undefined;
														return;
													}
													$inst.removeClass( 'error' ).addClass( 'success' ).html( '<img src="/__sow/images/accept.png" /> ' + data.ret_msg );
													$el = undefined;
													return;
												} ).fail( function ( jqXHR, textStatus ) {
													console.log( textStatus );
													if ( textStatus !== 'abort' ) {
														setError.call( $el, textStatus );
														$el = undefined;
													}
													$ajax = {}; $el = undefined;
												} );
											}
										} )
									};
									require( 'Sow.Net.Web.Validate' ).keyUp( $( 'form input[data-type="text"]' ), function ( $el, name ) {
										if ( typeof ( _c_work[name] ) !== "function" ) return;
										_c_work[name].call( this, $el, name );
									}, { "email": "email", "re_pass": "re_pass", "password": "password" }, true );
								} );
								$( 'form button' ).on( 'click', function ( e ) {
									var $owner = $( this ), $gmsg = $( '#_g_msg' );
									$owner.attr( 'disabled', true );
									var $frm = $( 'form input[data-type="text"]' );
									require( 'Sow.Net.Web.Validate' ).reset( $frm, function () {
										this.validate( $frm, function ( isErr, obj ) {
											if ( isErr ) {
												$owner.removeAttr( 'disabled' ); $owner = $gmsg = undefined;
												return;
											}
											if ( obj.password !== obj.re_pass ) {
												$owner.removeAttr( 'disabled' ); $owner = $gmsg = undefined;
												_invalidInput( $( "#re_pass" ), $( '[data-msg_name="re_pass"]' ), "Password does not match the confirm password!!" );
												return;
											}
											require( 'Sow.Net.Web.XHR' ).xhr( {
												type: "get",
												url: String.format( "/__sow/__handler/routemanager.ashx?q=SGINUP&def={0}", encodeURIComponent( JSON.stringify( obj ) ) ),
												dataType: 'json',
												xhrFields: { withCredentials: true }
											} ).done( function ( data ) {
												$gmsg.html( "" );
												if ( typeof ( data ) === 'string' ) {
													data = JSON.parse( data );
												}
												data.ret_val = parseInt( data.ret_val );
												$owner.removeAttr( 'disabled' ); $owner = undefined;
												if ( data.ret_val === -501 ) {
													$gmsg.html( data.ret_msg ); $gmsg = undefined;
													Sow.Async.execute( function () {
														_next();
													}, 1000 );
													return;
												}
												if ( data.ret_val > 0 ) {
													$gmsg = undefined;
													_next();
												}
												if ( data.ret_val === -1 ) {
													$gmsg.html( data.ret_msg ); $gmsg = undefined;
													return;
												}
												let rv = String( data.ret_val );
												if ( data.ret_val === -550 ) {
													$gmsg = undefined;
													let arr = JSON.parse( data.ret_msg );
													for ( let i = 0, l = arr.length; i < l; i++ ) {
														let karr = _MSG[String( arr[i] )];
														if ( !karr || !Sow.isArrayLike( karr ) ) {
															continue;
														}
														let kv = karr[0];
														$( '[data-msg_name="' + kv + '"]' ).removeClass( 'success' ).addClass( 'error' ).html( karr[1] );
														$( "#" + kv ).removeClass( 'ng-valid' )
															.removeClass( 'form-control-success' )
															.addClass( 'ng-invalid form-control-danger' );
													}
													return;
												}
												let res = _MSG[rv];
												if ( !Sow.isArrayLike( res ) ) {
													$gmsg.html( data.ret_msg ); $gmsg = undefined;
													return;
												}
												$gmsg = undefined;
												let key = res[0];
												$( '[data-msg_name="' + key + '"]' ).removeClass( 'success' ).addClass( 'error' ).html( res[1] || data.ret_msg );
												return;
											} ).fail( function ( jqXHR, textStatus ) {
												console.log( textStatus );
												$owner.removeAttr( 'disabled' );
												$gmsg.html( textStatus ); $owner = $gmsg = undefined;
											} );
										}, true );
										$frm = undefined;
										return;
									}, true );
								} );
							} ).fail( function ( jqXHR, textStatus ) {
								$gmsg.html( textStatus );
								$owner.removeAttr( 'disabled' ); $owner = undefined;
								console.log( textStatus );
								//location.reload( true );
							} );

						}
					};
				} );

			}, {
				'Sow.Net.Web.Controller': 3,
				'Sow.Net.Web.Data': 4,
				'Sow.Net.Web.View': 5,
				'Sow.Net.Web.XHR': 7,
				'Sow.Net.Web.Validate': 8
			}]
		}, {/**[cache]*/ }, /**[entry]*/[100, 101]]
	} ).registerNamespace(/**[settings]*/'Sow.Net.Web.Auth.ForgotPassword', function () {
		return /**[modules]*/[{
			//[Extend VIEW]
			100: [function ( require, module, exports ) {

				return module.aggregate( function () {
					return {
						onExecuteIo: function ( a, b, c ) {
							if ( typeof ( this[c] ) === 'function' )
								this[c]( a, b );
						},
					};
				} );

			}, {
				isExtend: true,
				ext_key: 5
			}],
			//[/Extend VIEW]
			101: [function ( require, module, exports ) {

				return module.aggregate( function () {
					return {
						ready: function ( a ) {
							require( 'Sow.Net.Web.XHR' ).xhr( {
								type: "get",
								url: "/__sow/__handler/routemanager.ashx?q=SGINOUT",
								dataType: 'json',
								xhrFields: { withCredentials: true }
							} ).done( function ( data ) {
								var _next = function ( next ) {
									if ( !next ) {
										next = Sow.getQuery( 'next' );
										if ( !next )
											location.href = next;
										location.href = "/urlroute.aspx";
										return;
									}
									location.href = next;
									return;
								};
								require( 'Sow.Net.Web.Validate' ).keyUp( $( 'form input[data-type="text"]' ), undefined, undefined, true );

								$( 'form button' ).on( 'click', function ( e ) {
									var $owner = $( this ), $gmsg = $( '#_g_msg' );
									$gmsg.removeClass( 'success' ).removeClass( 'error' ).html( "" );
									$owner.attr( 'disabled', true );
									var $frm = $( 'form input[data-type="text"]' );
									require( 'Sow.Net.Web.Validate' ).reset( $frm, function () {
										this.validate( $frm, function ( isErr, obj ) {
											if ( isErr ) {
												$owner.removeAttr( 'disabled' ); $owner = $gmsg = undefined;
												return;
											}
											require( 'Sow.Net.Web.XHR' ).xhr( {
												type: "get",
												url: String.format( "/__sow/__handler/routemanager.ashx?q=REQ_TOKEN&def={0}", encodeURIComponent( JSON.stringify( obj ) ) ),
												dataType: 'json',
												xhrFields: { withCredentials: true }
											} ).done( function ( data ) {
												$owner.removeAttr( 'disabled' ); $owner = undefined;
												if ( typeof ( data ) === 'string' ) {
													data = JSON.parse( data );
												}
												data.ret_val = parseInt( data.ret_val );
												
												if ( data.ret_val === -501 ) {
													$gmsg.addClass( 'error' ).html( data.ret_msg ); $gmsg = undefined;
													Sow.Async.execute( function () {
														_next();
													}, 1000 );
													return;
												}
												if ( data.ret_val < 0 ) {
													$gmsg.addClass( 'error' ).html( data.ret_msg ); $gmsg = undefined;
													return;
												}
												$gmsg.addClass( 'success' ).html( data.ret_msg ); $gmsg = undefined;
												Sow.Async.execute( function () {
													_next( data.next ); return;
												}, 1000 );
												return;
											} ).fail( function ( jqXHR, textStatus ) {
												console.log( textStatus );
												$owner.removeAttr( 'disabled' );
												$gmsg.addClass( 'error' ).html( textStatus ); $owner = $gmsg = undefined;
											} );
										}, true );
										$frm = undefined;
										return;
									}, true );
								} );
							} ).fail( function ( jqXHR, textStatus ) {
								console.log( textStatus ); location.reload( true );
							} );

						}
					};
				} );

			}, {
				'Sow.Net.Web.Controller': 3,
				'Sow.Net.Web.Data': 4,
				'Sow.Net.Web.View': 5,
				'Sow.Net.Web.XHR': 7,
				'Sow.Net.Web.Validate': 8
			}]
		}, {/**[cache]*/ }, /**[entry]*/[100, 101]]
	} ).registerNamespace(/**[settings]*/'Sow.Net.Web.Auth.ResetPassword', function () {
		return /**[modules]*/[{
			//[Extend VIEW]
			100: [function ( require, module, exports ) {

				return module.aggregate( function () {
					return {
						onExecuteIo: function ( a, b, c ) {
							if ( typeof ( this[c] ) === 'function' )
								this[c]( a, b );
						},
					};
				} );

			}, {
				isExtend: true,
				ext_key: 5
			}],
			//[/Extend VIEW]
			101: [function ( require, module, exports ) {

				return module.aggregate( function () {
					return {
						ready: function ( a ) {
							console.log( a );
							require( 'Sow.Net.Web.Data' ).a( "I'm Ready..." );
						}
					};
				} );

			}, {
					'Sow.Net.Web.Controller': 3,
					'Sow.Net.Web.Data': 4,
					'Sow.Net.Web.View': 5,
					'Sow.Net.Web.XHR': 7,
					'Sow.Net.Web.Validate': 8
			}]
		}, {/**[cache]*/ }, /**[entry]*/[100, 101]]
	} ).mapPageNamespace( ['Sow.Net.Web.Auth.Login', 'Sow.Net.Web.Auth.SginUp', 'Sow.Net.Web.Auth.ForgotPassword', 'Sow.Net.Web.Auth.ResetPassword'] );
