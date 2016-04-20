	$(function(){


    
		$('#form-login').validator().on('submit', function (e) {
		  if (e.isDefaultPrevented()) {
		 	
		  } else {
		   // $.LoadingOverlay("show");
		   // setTimeout(function(){ $.LoadingOverlay("hide");}, 4000);
		  }
		})

        $('#username').focus();


});



   

/*============================*/

var usuario = {
  'usuario':'Allan',
  'usuario_id':'7',
  'perfil':'5',
  'regiao_id':'1',
  'regiao':'Cianorte'

}

var app = angular.module("app", ['ngRoute']);

if (usuario.perfil == 5) {
app.config(['$routeProvider', function($routeProvider) {

  $routeProvider.
  when('/home', {
    templateUrl: 'lista-home-suporte.html',
    controller: 'HttpListaTicket',
  }).
  when('/chat/:IdTk', {
    templateUrl: 'chat-suporte.html',
    controller: 'HttpChat',
  }).
  otherwise({
    redirectTo: '/home'
  });
}]);

}else{
  app.config(['$routeProvider', function($routeProvider) {

  $routeProvider.
  when('/home', {
    templateUrl: 'lista-home.html',
    controller: 'HttpListaTicket',
  }).
  when('/chat/:IdTk', {
    templateUrl: 'chat.html',
    controller: 'HttpChat',
  }).
  otherwise({
    redirectTo: '/home'
  });
}]);
}
    	app.controller("HttpListaTicket", function ($scope, $http) {
          $scope.ListaTicket = {};
          $scope.alertCss = '';
          $scope.alertTxt = '';  
          $scope.status = 0;
          $scope.addUS = function(us,idu){

            $scope.usuarioTicket = us;
            $scope.idUser = idu;
            console.log($scope.idUser);

          }
        $scope.novoTicket = function(){
          
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

            $http.post('http://192.168.254.101:4000/cgi-bin/sunix2.cgi', fdata, config)
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
                alert('erro');
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
            $http.post('http://192.168.254.101:4000/cgi-bin/sunix2.cgi', fdata, config)
            .success(function (data, status, headers, config) {
                 $scope.idMsg = data.retorno_id;

                 if ( $scope.idMsg > 0) {
                 	  $('#modal-novo').modal("hide"); 
                    $scope.carregaTicket();
                    $scope.alertCss = '';
                    $scope.alertTxt = ''; 
                    $scope.ticket_mensagem = '';
                 }


            })
            .error(function (data, status, header, config) {
                // $scope.ResponseDetails = "Data: " + data +
                //     "<hr />status: " + status +
                //     "<hr />headers: " + header +
                //     "<hr />config: " + config;
                alert('erro');
            });

        }else{
          $scope.alertCss = 'ab';
          $scope.alertTxt = 'Escreva uma mensagem';  
        }
      }

		$scope.carregaTicket = function(){

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
      console.log(usuario.perfil)

       var fdata = $.param({
                _strmetdo_: 'proc_carrega_filtro_ticket',
                _strdata_mensagem_in: '01/01/2016',               
                _strdata_mensagem_out: data_f,
                _strticket_status: 0        
            });
        
      var config = {
                headers : {
                    'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
                }
            }

            $http.post('http://192.168.254.101:4000/cgi-bin/sunix2.cgi', fdata, config)
            .success(function (data, status, headers, config) {
              	$scope.ListaTicket = data.results_by_name.carrega_ticket.rows;
                
                console.log(data)
              	$scope.qtdMsg = data.retorno_id;
                if ($scope.qtdMsg > 0) {
                    $scope.ab = 'ab'
                    $('.datepicker').datepicker('update', new Date());
                }
            })
            .error(function (data, status, header, config) {
                // $scope.ResponseDetails = "Data: " + data +
                //     "<hr />status: " + status +
                //     "<hr />headers: " + header +
                //     "<hr />config: " + config;
                alert('erro');
            });

		}


     $scope.filtraTicket = function(){
          
          var fdata = $.param({
                _strmetdo_: 'proc_carrega_filtro_ticket',
                _strdata_mensagem_in: $scope.data_ini,               
                _strdata_mensagem_out:  $scope.data_fini,
                _strticket_status: $scope.status,
                _strusuario_id: $scope.idUser

            });
          console.log(fdata)
            var config = {
                headers : {
                    'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
                }
            }


            if($scope.data_ini <= $scope.data_fini ){
              $http.post('http://192.168.254.101:4000/cgi-bin/sunix2.cgi', fdata, config)
              .success(function (data, status, headers, config) {

                console.log(data)
                   $scope.idMsg = data.retorno_id;
                    console.log($scope.idMsg)

                   if ( $scope.idMsg > 0) {
                    $('#modal-filter').modal("hide"); 
                    $('.datepicker').datepicker('update', new Date());

                    $scope.ListaTicket = data.results_by_name.carrega_ticket.rows;

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
                  alert('erro');
              });
            }else{
              $scope.alertCss = 'ab';
              $scope.alertTxt = 'data inicial maior que data final';  

            }
            


        }

    $scope.carregaTicket();




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
                
            })
            .error(function (data, status, header, config) {
                $scope.ResponseDetails = "Data: " + data +
                    "<hr />status: " + status +
                    "<hr />headers: " + header +
                    "<hr />config: " + config;
            })
      }

      $scope.addUS = function(us,idu){

        $scope.usuarioTicket = us;
        $scope.idUser = idu;
        console.log($scope.idUser);

      }

    })


/*=====================CONTROLER CHAT==========================*/

app.controller("HttpChat", function ($scope, $http, $routeParams) {
  $scope.ListaMsg = {};
	var IdTk = $routeParams.IdTk;
  $scope.user = usuario.usuario_id;
    $scope.carregaMensagem = function(){
       var fdata = $.param({
                _strmetdo_: 'proc_carrega_ticket',
                _strticket_id: IdTk 

            });
      var config = {
                headers : {
                    'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
                }
            }

            $http.post('http://192.168.254.101:4000/cgi-bin/sunix2.cgi', fdata, config)
            .success(function (data, status, headers, config) {
                $scope.ListaMsg = data.results_by_name.carrega_ticket.rows;
                console.log(data)
                
            })
            .error(function (data, status, header, config) {
                // $scope.ResponseDetails = "Data: " + data +
                //     "<hr />status: " + status +
                //     "<hr />headers: " + header +
                //     "<hr />config: " + config;
                alert('erro');
            });

    }

        $scope.salvaMsg = function(){

          $scope.alertCss = '';
          $scope.alertTxt = '';
            var cts =  $scope.ticket_mensagem;

            console.log(cts.length);
           var fdata = $.param({
                _strmetdo_: 'proc_enviar_ticket',
                _strticket_mensagem: $scope.ticket_mensagem,               
                _strticket_id:  IdTk              
            });

           var config = {
                headers : {
                    'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
                }
            }
              if ($scope.ticket_mensagem != "" && $scope.ticket_mensagem != false && $scope.ticket_mensagem != undefined) {

            $http.post('http://192.168.254.101:4000/cgi-bin/sunix2.cgi', fdata, config)
            .success(function (data, status, headers, config) {
                 $scope.idMsg = data.retorno_id;
                 console.log($scope.idMsg)

                 if ( $scope.idMsg > 0) {
                  $('#responder').modal("hide"); 
                  $scope.ticket_mensagem = '';
                  $scope.carregaMensagem();

                 }


            })
            .error(function (data, status, header, config) {
                // $scope.ResponseDetails = "Data: " + data +
                //     "<hr />status: " + status +
                //     "<hr />headers: " + header +
                //     "<hr />config: " + config;
                alert('erro');
            });

              }else{
                  $scope.alertCss = 'ab';
                  $scope.alertTxt = 'Escreva uma mensagem';  
              }

                  

        }



      $scope.carregaMensagem();


})

