

var PathHost='sunix2.cgi';

function get_wurl(nurl){
  console.log(nurl)
   var rurl=PathHost+'?_strmetdo_='+nurl;
   return rurl;
}
var app = angular.module('appix', []);

app.controller('telaMain', function($scope, $http){

  $scope.ListaTicket = {};
  $scope.alertCss = '';
  $scope.alertTxt = '';  
  $scope.status = 0;


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

    $http.post(PathHost, fdata, config)
    .success(function (data, status, headers, config) {
     $scope.ListaTicket = data.results_by_name.carrega_ticket.rows;

     console.log(data)
     var _u = headers()['vgappx'];
     var user = $.parseJSON(_u);
     console.log(user)
     $scope.idUser = user.usuario_id;
     $scope.u_Nome = user.usuario;
     $scope.u_Regiao = user.regiao;

     $scope.qtdMsg = data.retorno_id;
     if($scope.qtdMsg > 0) {
      $scope.ab = 'ab'
      $scope.selectTela ={
        tela: get_wurl('lista-home.html')
      }
      $('.datepicker').datepicker('update', new Date());
      $scope.status = 0;
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
  // $scope.carregaTicket();

  $scope.filtraTicket = function(){

    var fdata = $.param({
      _strmetdo_: 'proc_carrega_filtro_ticket',
      _strdata_mensagem_in: $scope.data_ini,               
      _strdata_mensagem_out:  $scope.data_fini,
      _strticket_status: $scope.Tkstatus,
      _strusuario_id: $scope.idUser

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
    $http.post(PathHost, fdata, config)
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

    $scope.carregaMensagem = function(IdTk){

        $scope.selectTela = {
                  tela: get_wurl('chat.html')
                }
                console.log($scope.selectTela.tela)
      
       var fdata = $.param({
                _strmetdo_: 'proc_carrega_ticket',
                _strticket_id: IdTk 

            });
      var config = {
                headers : {
                    'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
                }
            }

            $http.post(PathHost, fdata, config)
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




})




//    app.controller("HttpListaTicket", function ($scope, $http) {
//           $scope.ListaTicket = {};
//           $scope.alertCss = '';
//           $scope.alertTxt = '';  
//           $scope.status = 0;
//           $scope.addUS = function(us,idu){

//             $scope.usuarioTicket = us;
//             $scope.idUser = idu;
//             console.log($scope.idUser);

//           }
//         $scope.novoTicket = function(){

//            $scope.alertCss = '';
//           $scope.alertTxt = '';  
//         		 var fdata = $.param({
//                 _strmetdo_: 'proc_criar_ticket',
//                 _strticket_departamento: 1               
//             });

//         		   var config = {
//                 headers : {
//                     'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
//                 }
//             }

//             $http.post(PathHost, fdata, config)
//             .success(function (data, status, headers, config) {
//                  $scope.IdTicket = data.retorno_id;


//                  if ($scope.IdTicket > 0) {
//                  	$('#modal-novo').modal('show') 

//                  }else{
//                  	alert("erro ao criar Ticket")
//                  }


//             })
//             .error(function (data, status, header, config) {
//                 // $scope.ResponseDetails = "Data: " + data +
//                 //     "<hr />status: " + status +
//                 //     "<hr />headers: " + header +
//                 //     "<hr />config: " + config;
//                 alert('erro');
//             });

//         }

//         $scope.salvaMsg = function(){
//             console.log('salvaMsg')

//         	 var fdata = $.param({
//                 _strmetdo_: 'proc_enviar_ticket',
//                 _strticket_mensagem: $scope.ticket_mensagem,               
//                 _strticket_id:  $scope.IdTicket               
//             });



//         	 var config = {
//                 headers : {
//                     'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
//                 }
//             }
//         if ($scope.ticket_mensagem != "" && $scope.ticket_mensagem != false && $scope.ticket_mensagem != undefined) {
//             $http.post(PathHost, fdata, config)
//             .success(function (data, status, headers, config) {
//                  $scope.idMsg = data.retorno_id;

//                  if ( $scope.idMsg > 0) {
//                  	  $('#modal-novo').modal("hide"); 
//                     $scope.carregaTicket();
//                     $scope.alertCss = '';
//                     $scope.alertTxt = ''; 
//                     $scope.ticket_mensagem = '';
//                  }


//             })
//             .error(function (data, status, header, config) {
//                 // $scope.ResponseDetails = "Data: " + data +
//                 //     "<hr />status: " + status +
//                 //     "<hr />headers: " + header +
//                 //     "<hr />config: " + config;
//                 alert('erro');
//             });

//         }else{
//           $scope.alertCss = 'ab';
//           $scope.alertTxt = 'Escreva uma mensagem';  
//         }
//       }

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

            $http.post(PathHost, fdata, config)
            .success(function (data, status, headers, config) {
              	$scope.ListaTicket = data.results_by_name.carrega_ticket.rows;

                console.log(data)
                 var _u = headers()['vgappx'];
                 var user = $.parseJSON(_u);
                 console.log(user)

              	$scope.qtdMsg = data.retorno_id;
                if ($scope.qtdMsg > 0) {
                    $scope.ab = 'ab'

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


//      $scope.filtraTicket = function(){

//           var fdata = $.param({
//                 _strmetdo_: 'proc_carrega_filtro_ticket',
//                 _strdata_mensagem_in: $scope.data_ini,               
//                 _strdata_mensagem_out:  $scope.data_fini,
//                 _strticket_status: $scope.status,
//                 _strusuario_id: $scope.idUser

//             });
//           console.log(fdata)
//             var config = {
//                 headers : {
//                     'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
//                 }
//             }


//             if($scope.data_ini <= $scope.data_fini ){
//               $http.post(PathHost, fdata, config)
//               .success(function (data, status, headers, config) {

//                 console.log(data)
//                    $scope.idMsg = data.retorno_id;
//                     console.log($scope.idMsg)

//                    if ( $scope.idMsg > 0) {
//                     $('#modal-filter').modal("hide"); 
//                     $('.datepicker').datepicker('update', new Date());

//                     $scope.ListaTicket = data.results_by_name.carrega_ticket.rows;

//                    }else{
//                     $scope.alertCss = 'ab';
//                     $scope.alertTxt = 'Nenhuma mensagem nesse periodo ou com este status';
//                    }


//               })
//               .error(function (data, status, header, config) {
//                   // $scope.ResponseDetails = "Data: " + data +
//                   //     "<hr />status: " + status +
//                   //     "<hr />headers: " + header +
//                   //     "<hr />config: " + config;
//                   alert('erro');
//               });
//             }else{
//               $scope.alertCss = 'ab';
//               $scope.alertTxt = 'data inicial maior que data final';  

//             }



//         }

//     $scope.carregaTicket();




//       $scope.carregaUsers = function(){
//           var fdata = $.param({
//                 _strmetdo_: 'proc_carrega_usuarios_ticket'
//             });

//             var config = {
//                 headers : {
//                     'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
//                 }
//             }

//             $http.post('/cgi-bin/sunix2.cgi', fdata, config)
//             .success(function (data, status, headers, config) {
//                 $scope.PostDataResponse = data.results_by_name.carrega_usuarios.rows;

//             })
//             .error(function (data, status, header, config) {
//                 $scope.ResponseDetails = "Data: " + data +
//                     "<hr />status: " + status +
//                     "<hr />headers: " + header +
//                     "<hr />config: " + config;
//             })
//       }

//       $scope.addUS = function(us,idu){

//         $scope.usuarioTicket = us;
//         $scope.idUser = idu;
//         console.log($scope.idUser);

//       }

//     })




// /*=====================CONTROLER CHAT==========================*/

// app.controller("HttpChat", function ($scope, $http) {
//   $scope.ListaMsg = {};
//   $scope.user = usuario.usuario_id;

//     carregaMensagem = function(IdTk){
//        var fdata = $.param({
//                 _strmetdo_: 'proc_carrega_ticket',
//                 _strticket_id: IdTk 

//             });
//       var config = {
//                 headers : {
//                     'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
//                 }
//             }

//             $http.post(PathHost, fdata, config)
//             .success(function (data, status, headers, config) {
//                 $scope.ListaMsg = data.results_by_name.carrega_ticket.rows;
//                 console.log(data)

//             })
//             .error(function (data, status, header, config) {
//                 // $scope.ResponseDetails = "Data: " + data +
//                 //     "<hr />status: " + status +
//                 //     "<hr />headers: " + header +
//                 //     "<hr />config: " + config;
//                 alert('erro');
//             });

//     }

//         $scope.salvaMsg = function(){

//           $scope.alertCss = '';
//           $scope.alertTxt = '';
//             var cts =  $scope.ticket_mensagem;

//             console.log(cts.length);
//            var fdata = $.param({
//                 _strmetdo_: 'proc_enviar_ticket',
//                 _strticket_mensagem: $scope.ticket_mensagem,               
//                 _strticket_id:  IdTk              
//             });

//            var config = {
//                 headers : {
//                     'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
//                 }
//             }
//               if ($scope.ticket_mensagem != "" && $scope.ticket_mensagem != false && $scope.ticket_mensagem != undefined) {

//             $http.post(PathHost, fdata, config)
//             .success(function (data, status, headers, config) {
//                  $scope.idMsg = data.retorno_id;
//                  console.log($scope.idMsg)

//                  if ( $scope.idMsg > 0) {
//                   $('#responder').modal("hide"); 
//                   $scope.ticket_mensagem = '';
//                   $scope.carregaMensagem();

//                  }


//             })
//             .error(function (data, status, header, config) {
//                 // $scope.ResponseDetails = "Data: " + data +
//                 //     "<hr />status: " + status +
//                 //     "<hr />headers: " + header +
//                 //     "<hr />config: " + config;
//                 alert('erro');
//             });

//               }else{
//                   $scope.alertCss = 'ab';
//                   $scope.alertTxt = 'Escreva uma mensagem';  
//               }



//         }



//       $scope.carregaMensagem();


// })

