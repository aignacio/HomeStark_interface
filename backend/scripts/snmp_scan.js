var os = require('os');
var snmp_net = require('net-snmp');
var snmp = require('snmpjs');
var http = require('http');
var util = require('util');
var colors = require('colors');
var constants = require('../var_constants');
var emoji = require('node-emoji');

var debug_snmp = false,
    nms_add = 'aaaa::1';
// Default options
var options = {
    port: 161,
    retries: 1,
    timeout: constants.timeResendGet,
    transport: "udp6",
    trapPort: 162,
    version: snmp.Version1
};
var devices_list  = [];
var global_device_index = 0,
    global_oid_index = 0;
var oids =  [{oid_value:["1.3.6.1.2.1.4.2.0"]},   // Local IPv6
             {oid_value:["1.3.6.1.2.1.4.20.0"]},  // Global IPV6
             {oid_value:["1.3.6.1.2.1.4.21.0"]},  // Rota preferencial
             {oid_value:["1.3.6.1.2.1.25.1.0"]},  // Heartbeat
             {oid_value:["1.3.6.1.2.1.25.2.0"]},  // RSSI
             {oid_value:["1.3.6.1.2.1.25.3.0"]},  // Rank RPL
             {oid_value:["1.3.6.1.2.1.25.4.0"]},  // Link Metric
             {oid_value:["1.3.6.1.2.1.25.5.0"]}]; // Hardware Address

/*************************** Trap treatment of device *************************/
var trapd   = snmp.createTrapListener();

Array.prototype.hasNode = function(element) {
    var i;
    for (i = 0; i < this.length; i++) {
        if (this[i].address_ipv6 === element) {
            return i; //Returns element position, so it exists
        }
    }
    return -1; //The element isn't in your array
};

trapd.on('trap', function(msg){
  var address_node = msg._src.address,
      exists = devices_list.hasNode(address_node);
  if (debug_snmp)
   console.log('[TRAP]'.black.bgWhite+' ['+nms_add.white+'] '+emoji.get(':arrow_left:')+emoji.get(':arrow_left:')+emoji.get(':arrow_left:')+' ['+address_node.white+']');
  if (exists != -1) {
    // console.log('Dispositivo '+address_node.white+' já registrado!\n \
    // \rAtualizando status do dispositivo: '+devices_list[exists].address_ipv6.white+' com active='+'true'.blue);
    devices_list[exists].active = true;
    devices_list[exists].poll = true;
  }
  else {
    if (debug_snmp)
      console.log("Registrando: ["+address_node.white+"]");
    var node = {
      address_ipv6:address_node,
      active:true,
      poll:true,
      heartbeat:'---',
      rssi_value:'---',
      pref_route:'---',
      rank_rpl:'---',
      link_metric:'---',
      global_ipv6:'---',
      local_ipv6:'---',
      hw_address:'---'
    };
    devices_list.push(node);
  }
});

trapd.bind({family: 'udp6', port: 162});
/*************************** Trap treatment of device *************************/
function processSNMP(oid, value){
  var data_vector = value.split("-");

  for (var i = 0; i < devices_list.length; i++){
    var final_ipv6 = devices_list[i].address_ipv6.split(":");
    if (data_vector[0].toLowerCase().search(final_ipv6[final_ipv6.length-1].toLowerCase()) > -1)
      break;
  }

  var content = data_vector[2];
  content = String(content);
  for (var j = 0; j < oids.length; j++) {
    if (oid == oids[0].oid_value) {         // Local IPv6
      devices_list[i].local_ipv6 = content.replace(/[\[\]']/g,'' );
      break;
    }
    else if (oid == oids[1].oid_value){     // Global IPv6
      devices_list[i].global_ipv6 = content.replace(/[\[\]']/g,'' );
      break;
    }
    else if (oid == oids[2].oid_value){     // Rota preferencial
      devices_list[i].pref_route = content.replace(/[\[\]']/g,'' );
      break;
    }
    else if (oid == oids[3].oid_value){     // Heartbeat
      devices_list[i].heartbeat = content;
      break;
    }
    else if (oid == oids[4].oid_value){     // RSSI
      var rssi_value = value.split('|');
      devices_list[i].rssi_value = rssi_value[1];
      break;
    }
    else if (oid == oids[5].oid_value){     // Rank RPL
      devices_list[i].rank_rpl = content;
      break;
    }
    else if (oid == oids[6].oid_value){     // Link Metric
      devices_list[i].link_metric = content;
      break;
    }
    else if (oid == oids[7].oid_value){     // Hardware Address
      devices_list[i].hw_address = content;
      break;
    }
  }
  if (debug_snmp){
    console.log('[GET-RESPONSE]'.black.bgWhite+' ['+oid.magenta+'] '+emoji.get(':arrow_right:')+' ['+devices_list[i].address_ipv6.white+'] '+emoji.get(':arrow_right:')+' ['+value+']');
    console.log('[GET-RESPONSE]'.black.bgWhite+' ['+oid.magenta+'] '+emoji.get(':arrow_right:')+' ['+nms_add.white+'] '+emoji.get(':arrow_left:')+emoji.get(':arrow_left:')+emoji.get(':arrow_left:')+' ['+devices_list[i].address_ipv6.white+']');
  }

}

function listDevices(special_feature){
  if (devices_list.length > 0) {
    console.log('Lista de dispositivos'.underline.white);
    var total_act_devices = 0;
    for (var index in devices_list)
      if (index < devices_list.length)
        if (devices_list[index].active == true)
          total_act_devices++;

    console.log('Dispostivos totais: '+String(devices_list.length).white+' / Ativos:'+String(total_act_devices).white);
    for (var index in devices_list) {
      if (index < devices_list.length) {
        var addr        = devices_list[index].address_ipv6,
            dev_stat    = devices_list[index].active,
            poll        = devices_list[index].poll,
            heartbeat   = devices_list[index].heartbeat
            rssi_value  = devices_list[index].rssi_value,
            pref_route  = devices_list[index].pref_route,
            rank_rpl    = devices_list[index].rank_rpl,
            link_metric = devices_list[index].link_metric,
            global_ipv6 = devices_list[index].global_ipv6,
            local_ipv6  = devices_list[index].local_ipv6,
            total       = devices_list.length,
            total_ativo = total_act_devices;
        if (dev_stat == true){
          dev_stat = 'ativo';
          console.log(emoji.get(':arrow_right:')+' Dispositivo IPv6: ['+addr.blue+']');
        }
        else {
          dev_stat = 'inativo';
          console.log(emoji.get(':arrow_right:')+' Dispositivo IPv6: ['+addr.red+']');
        }
        poll = String(poll);
        console.log('Status      :['+dev_stat.white+']');
        console.log('Poll        :['+poll.white+']');
        console.log('heartbeat   :['+heartbeat.white+']');
        console.log('RSSI(-x dBm):['+rssi_value.white+']');
        console.log('Rota pref.  :['+pref_route.white+']');
        console.log('Rank RPL    :['+rank_rpl.white+']');
        console.log('Link métrica:['+link_metric.white+']');
        console.log('IPv6 Global :['+global_ipv6.white+']');
        console.log('IPv6 Local  :['+local_ipv6.white+']');
      }
    }
  }
}

function cbSNMPnodes(error, varbinds, device) {
  if (error)
    console.error (error.toString ());
  else
    for (var i = 0; i < varbinds.length; i++)
      if (snmp_net.isVarbindError (varbinds[i]))
        console.error (snmp_net.varbindError (varbinds[i]));
      else
        processSNMP(String(varbinds[i].oid),String(varbinds[i].value));
}

function reqGetSNMP(){
  setTimeout(reqGetSNMP, constants.timeReqGet);
  var total_act_devices = 0;
  for (var index in devices_list)
    if (index < devices_list.length)
      if (devices_list[index].active == true)
        total_act_devices++;
  if (devices_list.length > 0 && total_act_devices > 0) {
    // if (debug_snmp)
    //   console.log('Requisitando dados SNMP dos dispositivos...'.underline.white);

    var dev_get = devices_list[global_device_index].address_ipv6,
        oid_get = oids[global_oid_index].oid_value;
    // console.log('Enviando GET OID para:'+devices_list[0].address_ipv6.white);

    if (debug_snmp)
      console.log('[GET]'.black.bgWhite+' OID: ['+String(oid_get).magenta+'] '+emoji.get(':arrow_right:')+' ['+nms_add.white+'] '+emoji.get(':arrow_right:')+emoji.get(':arrow_right:')+emoji.get(':arrow_right:')+' ['+dev_get.white+']');

    var session = snmp_net.createSession (dev_get, "public",options);
    session.get(oid_get, cbSNMPnodes);

    if (global_device_index < (devices_list.length-1)){
      global_device_index++
      for (var i = global_device_index; i < devices_list.length; i++)
        if (devices_list[global_device_index].active == true)
          break;
        else
          if ((global_device_index+1) < devices_list.length)
            global_device_index++;
    }
    else{
      global_device_index = 0;
      for (var i = global_device_index; i < devices_list.length; i++)
        if (devices_list[global_device_index].active == true)
          break;
        else
          if ((global_device_index+1) < devices_list.length)
            global_device_index++;

      if (global_oid_index < (oids.length-1))
        global_oid_index++
      else
        global_oid_index = 0;
    }
  }
}

function verifAliveDevices(){
  setTimeout(verifAliveDevices, constants.timeCheckList);
  for (var index in devices_list)
    if (index < devices_list.length)
      if (devices_list[index].poll == false) {
        var addr = devices_list[index].address_ipv6;
        if (debug_snmp)
          console.log('Dispositivo '+addr.red+' está '+'inativo'.red);
        // devices_list.splice(index,1); // We just inactive first
        devices_list[index].active = false;
        devices_list[index].poll = false;
      }
      else
        devices_list[index].poll = false; //Refresh the status to new scan ~50 seconds
  listDevices();
}

function init_snmp_can(){
  // Init the timer to send GET SNMP Messages
  setTimeout(reqGetSNMP, constants.timeSNMPRequest);
  // Init the timer to verify if the devices are alive
  setTimeout(verifAliveDevices, constants.timeCheckList);
}

init_snmp_can();
