/**
* Copyright (c) 2018, SOW (https://www.facebook.com/safeonlineworld). (https://github.com/RKTUXYN) All rights reserved.
* @author {SOW}
* @description {sow.messaging.js}
* @example { }
* Copyrights licensed under the New BSD License.
* See the accompanying LICENSE file for terms.
*/
/*messaging_v2:::12:18 AM 2/13/2019 # Desgined for support*/
( function ( _pageWindow, $ ) {
	if ( typeof ( Sow.define ) !== 'function'
		|| typeof ( Sow.registerNamespace ) !== 'function' )
		throw new Error( 'sow.webrtc.js couldn\'t be initilize. One of its dependency `sow.frameworkjs` or  sow.notify ' + ' couldn\t load properly... Please recheck..' );
	Sow.registerNamespace(/**[Namespace Name]*/'Sow.Net.Messaging', function () {
		return /**[modules]*/[{
			/** [Public instance module] */
			"messaging": [function ( require, module, exports ) {
				return {
					init: function ( hubname, conf ) {
						let event = {
							hash: "",
							server: {},
							client: {}
						};
                        Sow.hook( hubname ).add( "onNewUserConnected", function ( a ) {
                            require( 'core' ).online( a ); return;
                        } ).add( "onDisconnectUser", function ( a ) {
                            require( 'core' ).offline( a ); return;
                        } ).add( "onPrivateMessage", function ( hash, userName, message, msg_date, message_id ) {
                            Sow.async( function () { require( "core" ).onPrivateMessage( hash, userName, message, msg_date, message_id ); return; }, 0 );
                            return;
                        } ).add( "onLoadPrivateMessage", function ( toHash, data ) {
                            Sow.async( function () { require( "core" ).onLoadPrivateMessage( toHash, data ); return; }, 0 );
                            return;
                        } ).add( "onPrivateMessageKeyup", function ( hash ) {
                            Sow.async( function () { require( "core" ).onPrivateMessageKeyup( hash ); return; }, 0 );
                            return;
                        } ).add( "onLoadMembar", function ( seq, data ) {
                            Sow.async( function () { require( "core" ).onLoadMembar( data ); return; }, 0 );
                            return this;
                        } ).add( "onReconnected", function ( connectionId, hash, name, data ) {
                            Sow.async( function () { require( "core" ).onReconnected( connectionId, hash, name, data ); return; }, 0 );
                            return this;
                        } ).add( "onLoadCheckInPrivateMessage", function ( total ) {
                            Sow.async( function () { require( "core" ).onLoadCheckInPrivateMessage( total ); return; }, 0 );
                            return this;
                        } ).add( "onCheckOutPrivateMessage", function ( hash, total ) {
                            Sow.async( function () { require( "core" ).onCheckOutPrivateMessage( hash, total ); return; }, 0 );
                            return this;
                        } );
						require( 'core' ).run( event, conf || {} );
						var connected = false;
						return {
							connect: function ( connectionId, hash, name, data ) {
								let hub = {};
								if ( connected === false ) {
									hub = {
                                        server: {
                                            sendPrivateMessage: function ( toHash, message ) { },
                                            loadPrivateMessage: function ( toHash ) { },
                                            privateMessageKeyup: function ( toHash ) { },
                                            loadMembar: function ( seq ) { },
                                            checkInPrivateMessage: function ( toHash ) { },
                                            checkOutPrivateMessage: function ( toHash, message_id ) { },
                                            loadCheckInPrivateMessage: function () { }
                                        },
									};
									for ( let p in hub.server ) {
										hub.server[p] = this.server[p];
									}
									connected = true;
								}
								require( 'core' ).onConnect( hub.server, connectionId, hash, name, data );
								return this;
							}
						};
                    },
                    export_core: function () {
                        return require( 'core' );
                    }
				}
			}, {
				public: true,
				owner: 'Sow.Net.Messaging.Public',
				'core': 'messaging core'
			}],
			"messaging core": [function ( require, module, exports ) {
				var _config = {
					net: {},
                    data: [],
                    iam: {
                        here: false,
                        admin: false,
                        user: false
                    },
				};
                return {
                    is_init: false,
                    ext: {
                        event: function () {
                            let event = {
                                disposed: true,
                                worker: {},
                                external: {
                                    onLoadCheckInPrivateMessage: function ( total ) {
                                        event.external.onPrivateMessage( total, true );
                                    },
                                    onCheckOutPrivateMessage: function ( hash, total) {
                                        event.external.onPrivateMessage( total * -1 );
                                    },
                                    onPrivateMessage: function ( count, reset ) {
                                        if ( typeof ( count ) === "number" && count === 0 ) return;
                                        let $el = $( '[data-msg-key="u_total_msg"]' );
                                        let n = 0;
                                        if ( reset === true ) {
                                            n = typeof ( count ) === "number" ? count : 0;
                                        } else {
                                            let text = $el.text();
                                            n = parseInt( text );
                                            n = isNaN( n ) ? 0 : n;
                                            n = typeof ( count ) === "number" ? ( n + count ) : n + 1;
                                            if ( n < 0 ) n = 0;
                                        }
                                        $el.html( n );
                                        $el.effect( 'bounce', { times: 3 }, "slow" );
                                        $el.exit(); $el = undefined;
                                        return;
                                    },
                                    checkIn: function ( hash, userName, message, msg_date, message_id ) {
                                        this.checkInPrivateMessage( hash, message_id );
                                    },
                                },
                            };
                            return {
                                fire: function ( fn ) {
                                    if ( !_config.iam.here ) {
                                        if ( "function" !== typeof ( event.external[fn] ) ) return;
                                        event.external[fn].apply( this, Array.prototype.slice.call( arguments, 1 ) );
                                        if ( fn === "onPrivateMessage" )
                                            event.external.checkIn.apply( _config.net.server, Array.prototype.slice.call( arguments, 1 ) );
                                        return;
                                    };
                                    if ( event.disposed ) return;
                                    if ( "function" !== typeof ( event.worker[fn] ) ) {
                                        if ( "function" !== typeof ( event.external[fn] ) ) return;
                                        event.external[fn].apply( this, Array.prototype.slice.call( arguments, 1 ) );
                                        return;
                                    }
                                    event.worker[fn].apply( this, Array.prototype.slice.call( arguments, 1 ) );
                                    return;
                                },
                                dispose: function () {
                                    if ( Object.keys( event ).length <= 0 ) return;
                                    if ( typeof ( event.worker.dispose ) === "function" ) {
                                        event.worker.dispose();
                                        delete event.worker;
                                    }
                                    event.disposed = true;
                                },
                                register: function ( $user_elm, $chat_elm, core ) {
                                    event.disposed = false;
                                    event.worker = {
                                        cur_inf: {},
                                        enter: true,
                                        onCheckOutPrivateMessage: function ( hash, total ) {
                                            event.external.onPrivateMessage( total * -1 );
                                            core.unread( hash, $user_elm, 0 )
                                        },
                                        loadMembar: function ( hash ) {
                                            try {
                                                _config.net.server.loadMembar( "0" );
                                            } catch ( e ) {
                                                console.elog( e );
                                            }
                                        },
                                        onLoadMembar: function ( data ) {
                                            let out = "";
                                            for ( let i = 0, l = data.length; i < l; i++ ) {
                                                let row = data[i];
                                                if ( row.hash === _config.net.hash ) continue;
                                                row.status = this.isOnline( row.hash ) ? "online" : row.status;
                                                out += this.getHtml( row );
                                            }
                                            $( 'ul', $user_elm ).html( out );
                                        },
                                        onReconnected: function ( hash ) {
                                            if ( !hash || hash === _config.net.hash ) return;
                                            if ( event.worker.cur_inf.hash !== hash ) return;
                                            _config.net.server.loadPrivateMessage( hash );
                                        },
                                        online: function ( hash ) {
                                            let $req = $( '[data-hash="' + hash + '"]', $user_elm );
                                            if ( $req.length <= 0 ) return;
                                            $( "img", $req ).removeClass( "offline" ).addClass( "online" );
                                            $req.effect( 'bounce', { times: 3 }, "slow" );
                                            $req.exit(); $req = undefined;
                                        },
                                        offline: function ( hash ) {
                                            let $req = $( '[data-hash="' + hash + '"]', $user_elm );
                                            if ( $req.length <= 0 ) return;
                                            $( "img", $req ).removeClass( "online" ).addClass( "offline" );
                                            $req.effect( 'bounce', { times: 3 }, "slow" );
                                            $req.exit(); $req = undefined;
                                        },
                                        onPrivateMessage: function ( hash, userName, message, msg_date, message_id ) {
                                            if ( event.worker.cur_inf.hash !== hash ) {
                                                event.external.onPrivateMessage();
                                                this.unread( hash, $user_elm );
                                                _config.net.server.checkInPrivateMessage( hash, message_id );
                                                return;
                                            }
                                            _config.net.server.checkOutPrivateMessage( hash, message_id );
                                            this.writeMessage( $chat_elm, this.get_msg_html( {
                                                login_id: userName,
                                                msg_time: msg_date,
                                                full_name: userName,
                                                msg: !message ? "" : atob( message )
                                            } ) );
                                        },
                                        onLoadPrivateMessage: function ( toHash, data ) {
                                            let cur_u = Sow.Web.userInfo.LoginID;
                                            let out = "";
                                            for ( let i = 0, l = data.length; i < l; i++ ) {
                                                let row = data[i];
                                                out += this.get_msg_html( {
                                                    login_id: row.from_user_name,
                                                    msg_time: row.msg_date,
                                                    full_name: row.from_user_name === cur_u ? "You" : row.from_user_name,
                                                    msg: atob( row.message )
                                                } );
                                            }
                                            $( "ul", $chat_elm ).append( out ).delay( 50 ).animate( {
                                                opacity: '1.0'
                                            }, 300 ); out = undefined;
                                            let $container = $( '.chat-body.custom-scroll', $chat_elm );
                                            emojify.run( $container[0] );
                                            $container.scrollTop( $container[0].scrollHeight );
                                            $container = cur_u = data = undefined;
                                        },
                                        messageSent: function ( $text ) {
                                            if ( !( $text instanceof $ ) )
                                                throw new TypeError( "Invalid instance defined instead of jQuery" );
                                            let msg = $text.val();
                                            if ( !msg || msg === "" ) return;
                                            $text.val( "" );
                                            msg = msg.replace( /\n/gi, "<br/>" );
                                            core.writeMessage( $chat_elm, core.get_msg_html( {
                                                login_id: Sow.Web.userInfo.LoginID,
                                                msg_time: Sow.date.get() + " " + core.getTime(),
                                                full_name: "You",
                                                msg: msg
                                            } ) );
                                            Sow.async( function () { _config.net.server.sendPrivateMessage( event.worker.cur_inf.hash, btoa( msg ) ); return; }, 0 );
                                            return;
                                        },
                                        load_user: function ( $li ) {
                                            Sow.async( function () {
                                                let infd = $li.attr( "data-user-info" );
                                                if ( !infd ) return;
                                                let inf = JSON.parse( atob( infd ) );
                                                event.external.onPrivateMessage( core.unread( inf.hash, $user_elm, 0 ) );
                                                Sow.async( function () {
                                                    _config.net.server.checkOutPrivateMessage( inf.hash, null );
                                                } );
                                                let $header = $( "header", $chat_elm );
                                                let ohash = $header.attr( "data-hash" );
                                                if ( ohash === inf.hash ) return;
                                                $( "ul", $chat_elm ).html( "" );
                                                $header.attr( "data-hash", inf.hash );
                                                $header.find( "h2" ).remove();
                                                $header.find( "img" ).remove();
                                                $header.append( String.format( '<h2>{0}</h2> <img src="/app/api/get/any_user/image/?name={1}&t=sq" style="width:30px;float:right;margin-top:5px;">', inf.full_name, inf.login_id ) );
                                                event.worker.cur_inf = inf;
                                                $( ".chat-footer", $chat_elm ).removeClass( "disabled" );
                                                Sow.async( function () { _config.net.server.loadPrivateMessage( inf.hash ); return; }, 0 );
                                            } );
                                        },
                                        dispose: function () {
                                            if ( ( event.$elements instanceof [].constructor ) ) {
                                                for ( let $part; event.$elements.length && ( $part = event.$elements.shift() ); ) {
                                                    $part.off(); $part.exit(); $part = undefined;
                                                }
                                                delete event.$elements;
                                            }
                                            $user_elm.off(); $chat_elm.off();
                                            $user_elm.exit(); $user_elm = undefined;
                                            $chat_elm.exit(); $chat_elm = undefined;
                                            for ( let p in this )
                                                delete this[p];
                                            core = undefined;
                                            return;
                                        }
                                    };
                                    event.$elements = [];
                                    $user_elm.on( "click", function ( e ) {
                                        let $li = $( e.target ).closest( "li" );
                                        if ( $li.length <= 0 ) return;
                                        event.worker.load_user( $li );
                                    } );
                                    event.$elements.push(
                                        $( 'input[type="text"]', $user_elm ).on( "keyup", function ( e ) {
                                            //Search
                                        } )
                                    );
                                    event.$elements.push(
                                        $( "textarea", $chat_elm ).on( "keydown", function ( e ) {
                                            if ( !event.worker.enter ) return;
                                            if ( e.keyCode !== 13 ) {
                                                Sow.async( function () { _config.net.server.privateMessageKeyup( event.worker.cur_inf.hash ); return; }, 0 );
                                                return;
                                            };
                                            e.preventDefault();
                                            event.worker.messageSent( $( this ) );
                                            return false;
                                        } )
                                    );
                                    event.$elements.push(
                                        $( '[type="checkbox"]', $chat_elm ).on( "click", function ( e ) {
                                            event.worker.enter = $( this ).prop( "checked" );
                                        } )
                                    );
                                    event.$elements.push(
                                        $( "button", $chat_elm ).on( "click", function ( e ) {
                                            e.preventDefault();
                                            event.worker.messageSent( $( "textarea", $chat_elm ) );
                                        } )
                                    );
                                    $( ".chat-footer", $chat_elm ).addClass("disabled");
                                },
                            };
                        }(),
                        dispose: function () {
                            Object.extend( _config.iam, {
                                here: false, admin: false, user: false
                            } );
                            this.event.dispose();
                        },
                        register: function ( inf, $elm ) {
                            Object.extend( _config.iam, inf );
                            this.event.register( 
                                $( '[data-frame-type="live_user"]', $elm ),
                                $( '[data-frame-type="live_chat"]', $elm ),
                                require( "core" )
                            );
                            this.event.fire.call( this, "loadMembar" );
                            return this;
                        },
                    },
                    get_config: function () {
                        return _config;
                    },
                    onReconnected: function ( connectionId, hash, name, data ) {
                        _config.net.server.loadCheckInPrivateMessage();
                        if ( !_config.iam.here ) return;
                        this.ext.event.fire.call( this, "onReconnected", connectionId, hash, name, data );
                    },
                    onCheckOutPrivateMessage: function ( hash, total ) {
                        total = parseInt( total );
                        total = isNaN( total ) ? 0 : total;
                        this.ext.event.fire.call( this, "onCheckOutPrivateMessage", hash, total );
                        return;
                    },
                    onConnect: function ( server, connectionId, hash, name, data ) {
                        this.is_init = true;
						_config.data = ( data === null || typeof ( data ) !== 'object' ? [] : data );
						if ( typeof ( server ) === 'object' ) {
							_config.net.hash = hash;
							Object.extend( _config.net.server, server );
							server = undefined;
                        }
                        _config.net.server.loadCheckInPrivateMessage();
                        if ( !_config.iam.here ) return;
                        this.ext.event.fire.call( this, "loadMembar", hash );
						return this;
					},
					run: function ( net, conf ) {
						Object.extend( _config.net, net );
						net = undefined;
						this.init( conf );
					},
					init: function ( a ) {
						Object.extend( _config, a );
						return this;
                    },
                    onLoadCheckInPrivateMessage: function ( total ) {
                        this.ext.event.fire.call( this, "onLoadCheckInPrivateMessage", total );
                        return;
                    },
                    onPrivateMessageKeyup: function ( hash ) {
                        if ( !_config.iam.here ) return;
                        this.ext.event.fire.call( this, "onPrivateMessageKeyup", hash );
                        return;
                    },
                    online: function ( hash ) {
                        if ( !_config.iam.here || !hash ) return;
                        this.ext.event.fire.call( this, "online", hash );
                        return;
					},
                    offline: function ( hash ) {
                        if ( !_config.iam.here || !hash ) return;
                        this.ext.event.fire.call( this, "offline", hash );
                    },
                    getTime: function ( str ) {
                        if ( str )
                            return String( str ).split( "." )[0];
                        let dt = new Date();
                        return dt.getHours() + ":" + dt.getMinutes() + ":" + dt.getSeconds();
                    },
                    writeMessage: function ( $el, msg ) {
                        //let $uel = $( "ul", $el );
                        //$uel.chatbox( "option", "boxManager" ).loadMsg( $uel, msg );
                        let $item = $( msg );
                        emojify.run( $item[0] );
                        $( "ul", $el ).append( $item );
                        $item = undefined;
                        let $container = $( '.chat-body.custom-scroll', $el );
                        $container.scrollTop( $container[0].scrollHeight );
                        return this;
                    },
                    get_msg_html: function ( inf ) {
                        return String.format( `<li class="message">
                                                  <img src="/app/api/get/any_user/image/?name={0}" style="width: 50px;">
                                                  <div class="message-text">
                                                     <time>{1}</time>
                                                     <a href="javascript:void(0);" class="username">{2}</a>
                                                     {3}
                                                  </div>
                                               </li>`.replace( /\n/gi, "" ).replace( /\\t/gi, " " ).replace( /\s+/g, " " ),
                            inf.login_id, inf.msg_time, inf.full_name, inf.msg
                        );
                    },
                    unread: function ( hash, $user_elm, c ) {
                        let $req = $( '[data-hash="' + hash + '"]', $user_elm );
                        if ( $req.length <= 0 ) return;
                        let $treq = $( '[data-msg-key="total_msg"]', $req );
                        let n = 0;
                        let text = $treq.text();
                        let x = parseInt( text );
                        x = isNaN( x ) ? 0 : x;
                        if ( typeof ( c ) !== "number" ) { n++; n = n + x; }
                        $treq.html( n );
                        if ( x > 0 && typeof ( c ) === "number" )
                            $treq.effect( 'bounce', { times: 3 }, "slow" );
                        $treq.exit(); $req.exit(); $treq = $req = undefined;
                        return x * -1;
                    },
					getHtml: function ( inf ) {
						let _class;
						inf.status === "offline" ? ( _class = 'usr offline', inf.status = "incognito" ) : ( _class = 'usr online' );
                        return String.format( `<li class="message" data-user-info="{0}" data-hash="{1}">
                                            <img src="/app/api/get/any_user/image/?name={2}" class="{3}" alt="" style="width: 50px;">
                                            <div class="message-text">
                                                <time>{4}</time>
                                                <a href="javascript:void(0);" class="username">{5}</a>
                                                <b data-msg-key="total_msg" class="badge bg-color-red bounceIn animated">{6}</b>
                                            </div>
                                        </li>`.replace( /\n/gi, "" ).replace( /\\t/gi, " " ).replace( /\s+/g, " " ),
                            btoa( JSON.stringify( {
                                hash: inf.hash,
                                login_id: inf.login_id,
                                full_name: inf.full_name
                            } ) ), inf.hash, inf.login_id, _class, "", inf.login_id, ( inf.total_check_in || 0 )
                        );
					},
					isOnline: function ( hash ) {
						return _config.data.find( a => a.hash === hash );
					},
                    onPrivateMessage: function ( hash, userName, message, msg_date, message_id ) {
                        this.ext.event.fire.call( this, "onPrivateMessage", hash, userName, message, msg_date, message_id );
					},
                    onLoadPrivateMessage: function ( toHash, data ) {
                        if ( !_config.iam.here ) return;
                        if ( data === null ) return this;
                        if ( typeof ( data ) === 'string' ) data = JSON.parse( data );
                        this.ext.event.fire.call( this, "onLoadPrivateMessage", toHash, data );
						return this;
					},
                    onLoadMembar: function ( data ) {
                        if ( !_config.iam.here ) return;
                        if ( data === null ) return this;
                        if ( typeof ( data ) === 'string' ) data = JSON.parse( data );
                        this.ext.event.fire.call( this, "onLoadMembar", data );
                        return this;
					}
				};
			}, {
				'core': 'messaging core'
			}]
		}, {/**[cache]*/ }, /**[entry]*/["messaging", "messaging core"]];

	} );

}( window || this, jQuery ) );