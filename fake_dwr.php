<?php
    header('Access-Control-Allow-Origin: *');
    header('Content-Type: text/javascript');
    $tag = "throw 'allowScriptTagRemoting is false.';";
    $r = $_GET;
    if(isset($r["script"]) or isset($r["method"])){
            $rawquery = array(
                'callCount' => "1",
                'nextReverseAjaxIndex' => "0",
                'c0-scriptName' => $r["script"],
                'c0-methodName' => $r["method"],
                'c0-id' => "0",
                'batchId' => "0",
                'instanceId' => "0",
                'page' => "null",
                'scriptSessionId' => "null"
            );
            $options = array('http' =>
                array(
                    'method'  => 'GET',
                    'header'  => 'Content-type: text/plain'
                )
            );
            if(isset($r['batchId'])){
                $rawquery['batchId'] = $r['batchId'];
            }
            if(isset($r['scriptSessionId'])){
                $rawquery['scriptSessionId'] = $r['scriptSessionId'];
            }
            if(isset($r['scriptSessionId'])){
                $rawquery['scriptSessionId'] = $r['scriptSessionId'];
            }
            if(isset($r['params']) and is_array($r['params'])){
                foreach($r['params'] as $key=>$param){
                    $rawquery['c0-param'.$key] = $param;
                }
            }
            $query = http_build_query($rawquery);
            $output = file_get_contents('https://ekool.ee/dwr/call/plaincall/'.$r["script"].'.'.$r["method"].'.dwr?' . $query, false, stream_context_create($options));
            echo("//#DWR-Remote made by github.com/roledxd\r\n//".$output);
    }
    else{
        dwrException("script and method are empty");
    }

    function dwrException($message){
        if(!isset($message)){
            $message = "Error";
        }
        exit("//#DWR-Remote made by github.com/roledxd\r\n"
        ."//#DWR-INSERT\r\n"
        ."//#DWR-REPLY\r\n"
        ."//#DWR-START#\r\n"
        ."(function(){\r\n"
        ."if(!window.dwr)return;\r\n"
        ."var dwr=window.dwr._[0];\r\n"
        ."dwr.engine.remote.handleException('0','0',{javaClassName:'java.lang.Throwable',message:'".$message."'});\r\n"
        ."})();\r\n"
        ."//#DWR-END#\r\n");
    }

?>