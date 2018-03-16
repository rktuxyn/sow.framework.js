Sow.registerNamespace(/**[settings]*/'Sow.Net.Web.Auth.Login', function () {
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
								"-103": ['email', 'Hmmm, invalid @User ! Or <a href="/auth/requestpassword.aspx">Forgot @User !</a> !'],
								"-104": ['password', 'Hmmm, this password dont match with @User...! Or <a href="/auth/requestpassword.aspx">Forgot !</a>'],
								"103": ['email', 'This @User Exists Our System !']
							}, _next = function () {
								let next = Sow.getQuery( 'next' );
								if ( !next )
									location.href = next;
								location.href = "/urlroute.aspx";
								return;
							};

							$( 'form button' ).on( 'click', function ( e ) {
								var $owner = $( this ), gmsg = $( '#_g_msg' );
								$owner.attr( 'disabled', true );
								require( 'Sow.Net.Web.Validate' ).reset( function () {
									this.validate( $( 'form input[data-type="text"]' ), function ( isErr, obj ) {
										if ( isErr ) {
											$owner.removeAttr( 'disabled' ); $owner = gmsg = undefined;
											return;
										}
										require( 'Sow.Net.Web.XHR' ).xhr( {
											type: "get",
											url: String.format( "/__sow/__handler/routemanager.ashx?q=SGININ&def={0}", encodeURIComponent( JSON.stringify( obj ) ) ),
											dataType: 'json',
											xhrFields: { withCredentials: true }
										} ).done( function ( data ) {
											gmsg.html( "" );
											if ( typeof ( data ) === 'string' ) {
												data = JSON.parse( data );
											}
											data.ret_val = parseInt( data.ret_val );
											$owner.removeAttr( 'disabled' ); $owner = undefined;
											if ( data.ret_val === -501 ) {
												gmsg.html( data.ret_msg ); gmsg = undefined;
												Sow.Async.execute( function () {
													_next();
												}, 1000 );
												return;
											}
											if ( data.ret_val > 0 ) {
												gmsg = undefined;
												_next();
											}
											if ( data.ret_val === -1 ) {
												gmsg.html( data.ret_msg ); gmsg = undefined;
												return;
											}
											let rv = String( data.ret_val );
											if ( data.ret_val === -550 ) {
												gmsg = undefined;
												let arr = JSON.parse( data.ret_msg );
												for ( let i = 0, l = arr.length; i > l; i++ ) {
													let karr = _MSG[String(arr[i])];
													if ( !karr || !Sow.isArrayLike( karr ) ) {
														continue;
													}
													let kv = karr[0];
													$( '[data-msg_name="' + kv + '"]' ).removeClass( 'success' ).addClass( 'error' ).html( karr[1] );
												}
												return;
											}
											let res = _MSG[rv];
											if ( !Sow.isArrayLike( res ) ) {
												gmsg.html( data.ret_msg ); gmsg = undefined;
												return;
											}
											gmsg = undefined;
											let key = res[0];
											$( '[data-msg_name="' + key + '"]' ).removeClass( 'success' ).addClass( 'error' ).html( res[1] || data.ret_msg );
											return;
										} ).fail( function ( jqXHR, textStatus ) {
											console.log( textStatus );
											$owner.removeAttr( 'disabled' );
											gmsg.html( textStatus ); $owner = gmsg = undefined;
										} );
									}, true );
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
} ).registerNamespace(/**[settings]*/'Sow.Net.Web.Auth.Register', function () {
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
			'Sow.Net.Web.View': 5
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
							$( 'form button' ).on( 'click', function ( e ) {
								require( 'Sow.Net.Web.Validate' ).reset( function () {
									this.validate( $( 'form input[data-type="text"]' ), function ( isErr, obj ) {
										if ( isErr ) return;
										require( 'Sow.Net.Web.XHR' ).xhr( {
											type: "get",
											url: String.format( "/__sow/__handler/routemanager.ashx?q=SGININ&def={0}", encodeURIComponent( JSON.stringify( { user_name: obj.email, password: obj.password } ) ) ), dataType: 'json',
											xhrFields: { withCredentials: true }
										} ).done( function ( data ) {
											console.log( data );
										} ).fail( function ( jqXHR, textStatus ) {
											console.log( textStatus );
										} );
									} );
								} );
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
			'Sow.Net.Web.View': 5
		}]
	}, {/**[cache]*/ }, /**[entry]*/[100, 101]]
} ).registerNamespace(/**[settings]*/'Sow.Net.Web.Auth.RequestPassword', function () {
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
			'Sow.Net.Web.View': 5
		}]
	}, {/**[cache]*/ }, /**[entry]*/[100, 101]]
} ).mapPageNamespace( ['Sow.Net.Web.Auth.Login', 'Sow.Net.Web.Auth.SginUp', 'Sow.Net.Web.Auth.RequestPassword'] );