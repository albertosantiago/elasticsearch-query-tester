var requestsEditor;
var savedQueries;

function makeRequest(){
    var params = {
        url:   $("#url").val(),
        q: requestsEditor.getSession().getValue()
    };
    var jqxhr = $.get('/make-request', params, function(data) {
        $("#response").JSONView(data,{collapsed: true});
    }).fail(function(error) {
        $("#response").JSONView(error,{collapsed: true});
    });
}

function saveRequest(){
    var params = {
        url:  $("#url").val(),
        name: $("#query-name").val(),
        q: requestsEditor.getSession().getValue()
    };
    var jqxhr = $.get('/save-request', params, function(data) {
          $('#save-form').modal('hide');
          reloadSavedQueries()
    });
}

function loadQuery(){
    var id= $("#query-selector").val();
    for(var i=0; i< savedQueries.length;i++){
        if(id==savedQueries[i].id){
            $("#url").val(savedQueries[i].url);
            requestsEditor.getSession().setValue(savedQueries[i].q);
            return;
        }
    }
}

function removeQuery(){
    var id= $("#query-selector").val();
    var params = {
        id: id
    };
    var jqxhr = $.get('/remove-query', params, function(data) {
          reloadSavedQueries()
    });
}

function cleanResults(){
    $("#response").JSONView({});
}

function reloadSavedQueries(){
    $.getJSON("/saved-queries", function(data){
        savedQueries = data;
        var selectStr = "";
        if(savedQueries.length!==0){
            for(var i=0; i< savedQueries.length;i++){
                selectStr += "<option value='"+savedQueries[i].id+"'>"+savedQueries[i].name+" - "+savedQueries[i].created_at+"</option>";
            }
        }else{
            selectStr = '<option value="-1">No queries saved</option>';    
        }
        $("#query-selector").html(selectStr);
    });
}

$(function(){
    $("#go").click(function(){
        makeRequest();
    });
    reloadSavedQueries();
    requestsEditor = ace.edit("query");
    requestsEditor.getSession().setMode("ace/mode/json");

});
