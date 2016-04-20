
var PathHost='http://192.168.254.101:4000/cgi-bin/sunix2.cgi';

function get_wurl(nurl){
 var rurl=PathHost+'?_strmetdo_='+nurl;
 return rurl;
}

function looad(timer){
	if(timer){
		$.LoadingOverlay("show");

		// Hide it after 3 seconds
		setTimeout(function(){
		    $.LoadingOverlay("hide");
		}, timer);
	}else{
		
	$.LoadingOverlay("show");

		// Hide it after 3 seconds
		setTimeout(function(){
		    $.LoadingOverlay("hide");
		}, 500);
	}
}

var appx = angular.module("appix",[]);

appx.controller('ctrlmain',function($scope, $http, $rootScope) {

      /**carrega ticket**/
	  $rootScope.proc_carregaTicket = function(){	   
	   // $('#divmain').empty();//limpa div main

	   
	   looad()
		var d = new Date();
		function zeroEsquerda(n){
		  n = String(n)
		  var num = n.length;
		  if(num == 1){
			var re = '0'+n;
		  }else{
			var re = n;
		  }
		  return re;
		}

		var data_f = zeroEsquerda(d.getDate())+'/'+zeroEsquerda((d.getMonth() + 1))+'/'+d.getFullYear();
		$rootScope.data_ini = data_f;
		$rootScope.data_fini = data_f;

		var fdata = $.param({
		  _strmetdo_: 'proc_carrega_ticket',
		  // _strdata_mensagem_in: '01/01/2016',               
		  // _strdata_mensagem_out: data_f,
		  // _strticket_status: 2        
		});
            var config = {headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}}			
              $http.post(PathHost, fdata, config)
              .success(function (data, status, headers, config) {
              	console.log(data)
			  //console.log(headers()['vgappx']);
		     $scope.ListaTicket = data.results_by_name.carrega_ticket.rows;
			 var _u = headers()['vgappx'];
			 var user = $.parseJSON(_u);
			 console.log(user);
			 $rootScope.idUser = user.usuario_id;
			 $rootScope.u_Nome = user.usuario;
			 $rootScope.u_Regiao = user.regiao;
			 $rootScope.u_Regiao_id = user.regiao_id;
			 $rootScope.qtdMsg = user.retorno_id;
			 $rootScope.perfil = user.perfil;


			 if ($rootScope.perfil == 5) {
			 	$scope.rpathw = get_wurl('lista-home-suporte.html');
			 }else{	
			 	$scope.rpathw = get_wurl('lista-home.html');
			 }


			 
			 if($scope.qtdMsg > 0) {
			  //$scope.ab = 'ab'
			  
			  //$('.datepicker').datepicker('update', new Date());
			  //$scope.status = 0;
			  }

              })
              .error(function (data, status, header, config) {			  
                  console.log('erro proc_carrega_ticket proc_carregaTicket');
              });
          }
	
	/**carregaMensagem**/

      $rootScope.proc_carregaMensagem = function(IdTk){
      	looad()
	 
	  $rootScope.IdT= IdTk;
             var fdata = $.param({
                _strmetdo_: 'proc_carrega_ticket',
                _strticket_id: IdTk 
             });
			
            var config = {headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}}
            $http.post(PathHost, fdata, config)
            .success(function (data, status, headers, config) {
            	$rootScope.msgsQtd = data.retorno_id;
                $scope.ListaMsg = data.results_by_name.carrega_ticket.rows;
                $rootScope.IdT =  data.results_by_name.carrega_ticket.rows[0].r.ticket_id;
                $rootScope.statusID =  data.results_by_name.carrega_ticket.rows[0].r.ticket_status;

                console.log($rootScope.IdT);
                if ($rootScope.perfil == 5) {
                	$scope.rpathw = get_wurl('chat-suporte.html');

                	$("html, body").animate({ scrollTop: $(document).height() }, 500);
                }else{	
                	$scope.rpathw = get_wurl('chat.html');
                	$("html, body").animate({ scrollTop: $(document).height() }, 500);
                }
                $('.datepicker').datepicker('update', new Date());

                
            })
            .error(function (data, status, header, config) {
                console.log('erro proc_carrega_ticket proc_carregaMensagem');
            });



            $rootScope.loadMsg = setInterval(function(){

            				 console.log(555)
  						var fdata = $.param({
                		_strmetdo_: 'proc_carrega_ticket',
                		_strticket_id:  $rootScope.IdT 
             		});
			
	            var config = {headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}}
	            $http.post(PathHost, fdata, config)
	            .success(function (data, status, headers, config) {
	                
	                if(data.retorno_id > $rootScope.msgsQtd){
	                	$rootScope.proc_carregaMensagem($rootScope.IdT)
	                	// console.log('dentro')
	                	 navigator.vibrate([300,300]);
	                	
	                	 // navigator.notification.beep(2);


	                }else{
	                	// console.log('fora')
	                	// console.log(data.retorno_id,$rootScope.msgsQtd)
	                }

	            })
	            .error(function (data, status, header, config) {
	                console.log('erro proc_carrega_ticket setInte $rootScope.loadMsg');
	            });
  				}, 5000)
      }
	  
	/**inicializar**/

	 $scope.proc_carregaTicket()	
})

appx.controller('ctrlHome',function($scope, $http, $rootScope) {

		
	  $scope.filtraTicket = function(){
		looad()
	    var fdata = $.param({
	      _strmetdo_: 'proc_carrega_filtro_ticket',
	      _strdata_mensagem_in: $scope.data_ini,               
	      _strdata_mensagem_out:  $scope.data_fini,
	      _strticket_status: $scope.Tkstatus,
	      _strusuario_id: $scope.idUserF

	    });
	    console.log(fdata)
	    var config = {
	      headers : {
	        'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
	      }
	    }


    if($scope.data_ini <= $scope.data_fini ){
      $http.post(PathHost, fdata, config)
      .success(function (data, status, headers, config) {

        console.log(data)
        $scope.idMsg = data.retorno_id;
        console.log($scope.idMsg)

        if ( $scope.idMsg > 0) {
          $('#modal-filter').modal("hide"); 
          $('.datepicker').datepicker('update', new Date());

          $scope.ListaTicket = data.results_by_name.carrega_ticket.rows;
          	$scope.alertCss = '';
      		$scope.alertTxt = ''; 
      		$scope.usuarioTicket = '';
        	$scope.idUserF = '';
       
        }else{
          $scope.alertCss = 'ab';
          $scope.alertTxt = 'Nenhuma mensagem nesse periodo ou com este status';
        }


      })
      .error(function (data, status, header, config) {
                  // $scope.ResponseDetails = "Data: " + data +
                  //     "<hr />status: " + status +
                  //     "<hr />headers: " + header +
                  //     "<hr />config: " + config;
                  console.log('erro proc_carrega_filtro_ticket filtraTicket');
                });
    }else{
      $scope.alertCss = 'ab';
      $scope.alertTxt = 'data inicial maior que data final';  

    }
  }


   $scope.novoTicket = function(){
   	looad(3000)
   	$('#bt-novo-ticket').attr('disabled', 'disabled');


   $scope.alertCss = '';
   $scope.alertTxt = '';  
   var fdata = $.param({
    _strmetdo_: 'proc_criar_ticket',
    _strticket_departamento: 1               
  });

   var config = {
    headers : {
      'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
    }
  }

  $http.post(PathHost, fdata, config)
  .success(function (data, status, headers, config) {
   $scope.IdTicket = data.retorno_id;


   if ($scope.IdTicket > 0) {
     $('#modal-novo').modal('show') 

   }else{
     alert("erro ao criar Ticket")
   }


 })
  .error(function (data, status, header, config) {
                // $scope.ResponseDetails = "Data: " + data +
                //     "<hr />status: " + status +
                //     "<hr />headers: " + header +
                //     "<hr />config: " + config;
                console.log('erro proc_criar_ticket novoTicket');
              });

}

$scope.salvaMsg = function(){
	
  console.log('salvaMsg')

  var fdata = $.param({
    _strmetdo_: 'proc_enviar_ticket',
    _strticket_mensagem: $scope.ticket_mensagem,               
    _strticket_id:  $scope.IdTicket               
  });
  var config = {
    headers : {
      'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
    }
  }
  if ($scope.ticket_mensagem != "" && $scope.ticket_mensagem != false && $scope.ticket_mensagem != undefined) {
       $('#modal-novo').modal("hide"); 
       $('#bt-novo-ticket').removeAttr("disabled");
       looad(5000)
    $http.post(PathHost, fdata, config)
    .success(function (data, status, headers, config) {
     $scope.idMsg = data.retorno_id;

     if ( $scope.idMsg > 0) {
       // $scope.carregaTicket();
       $scope.alertCss = '';
       $scope.alertTxt = ''; 
       $scope.ticket_mensagem = '';
       setTimeout(function(){ $rootScope.proc_carregaTicket();}, 3000);
       
     }else{
     	 $('#modal-novo').modal("show");
     }


   })
    .error(function (data, status, header, config) {
                // $scope.ResponseDetails = "Data: " + data +
                //     "<hr />status: " + status +
                //     "<hr />headers: " + header +
                //     "<hr />config: " + config;
                console.log('erro proc_enviar_ticket salvaMsg');
              });

  }else{
    $scope.alertCss = 'ab';
    $scope.alertTxt = 'Escreva uma mensagem';  
  }
}

 $scope.carregaUsers = function(){
        	
          var fdata = $.param({
                _strmetdo_: 'proc_carrega_usuarios_ticket'
            });
        
            var config = {
                headers : {
                    'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
                }
            }

            $http.post('/cgi-bin/sunix2.cgi', fdata, config)
            .success(function (data, status, headers, config) {
                $scope.PostDataResponse = data.results_by_name.carrega_usuarios.rows;
                console.log(data)
                
            })
            .error(function (data, status, header, config) {
                $scope.ResponseDetails = "Data: " + data +
                    "<hr />status: " + status +
                    "<hr />headers: " + header +
                    "<hr />config: " + config;

                    console.log('erro proc_carrega_usuarios_ticket carregaUsers')
            })
      }

      $scope.addUS = function(us,idu){

        $scope.usuarioTicket = us;
        $scope.idUserF = idu;
      

      }    
});




/*=====================CONTROLER CHAT==========================*/

appx.controller("ctrlChat", function ($scope, $http, $rootScope) {
	
  					

    // carregaMensagem = function(IdTk){
    //    var fdata = $.param({
    //             _strmetdo_: 'proc_carrega_ticket',
    //             _strticket_id: IdTk 

    //         });
    //   var config = {
    //             headers : {
    //                 'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
    //             }
    //         }

    //         $http.post('PathHost', fdata, config)
    //         .success(function (data, status, headers, config) {
    //             $scope.ListaMsg = data.results_by_name.carrega_ticket.rows;
    //             console.log(data)
                
    //         })
    //         .error(function (data, status, header, config) {
    //             // $scope.ResponseDetails = "Data: " + data +
    //             //     "<hr />status: " + status +
    //             //     "<hr />headers: " + header +
    //             //     "<hr />config: " + config;
    //             console.log('erro');
    //         });

    // }


        $scope.salvaMsgChat = function(){

          $scope.alertCss = '';
          $scope.alertTxt = '';
            var cts =  $scope.ticket_mensagem;

            console.log(cts.length);
           var fdata = $.param({
                _strmetdo_: 'proc_enviar_ticket',
                _strticket_mensagem: $scope.ticket_mensagem,               
                _strticket_id:  $rootScope.IdT            
            });

           var config = {
                headers : {
                    'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
                }
            }
              if ($scope.ticket_mensagem != "" && $scope.ticket_mensagem != false && $scope.ticket_mensagem != undefined) {
                  $('#responder').modal("hide"); 

            $http.post(PathHost, fdata, config)
            .success(function (data, status, headers, config) {
                 $scope.idMsg = data.retorno_id;
                 console.log($scope.idMsg)


                 if ( $scope.idMsg > 0) {
                  $scope.ticket_mensagem = '';
                  $rootScope.proc_carregaMensagem($rootScope.IdT);


                 }else{

                  $('#responder').modal("show"); 
                 }


            })
            .error(function (data, status, header, config) {
                // $scope.ResponseDetails = "Data: " + data +
                //     "<hr />status: " + status +
                //     "<hr />headers: " + header +
                //     "<hr />config: " + config;
                console.log('erro proc_enviar_ticket salvaMsgChat');
            });

              }else{
                  $scope.alertCss = 'ab';
                  $scope.alertTxt = 'Escreva uma mensagem';  
              }


        }
              $scope.paraLoadMsg = function(){
              	$rootScope.proc_carregaTicket();
              	clearInterval($rootScope.loadMsg)
              }


              $scope.fecha_ticket = function(idT){
              	 $('#encerrar').modal("hide");
              	var fdata = $.param({
	                _strmetdo_: 'proc_fecha_ticket',
	                _strticket_id: idT
	             });

              	var config = {
                headers : {
                    'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
                }
            }

            $http.post('/cgi-bin/sunix2.cgi', fdata, config)
            .success(function (data, status, headers, config) {
               
                $rootScope.proc_carregaTicket();
                clearInterval($rootScope.loadMsg)
                
            })
            .error(function (data, status, header, config) {
                $scope.ResponseDetails = "Data: " + data +
                    "<hr />status: " + status +
                    "<hr />headers: " + header +
                    "<hr />config: " + config;
            })



              }
       


})

