const url = "https://api-for-image-optimizer.glitch.me/form-submit";

function Validate()
{
    var msg= "",
        fields = document.getElementById("myform").getElementsByTagName("input");
        textearea = document.getElementById("comment");

    for (var i=0; i<fields.length; i++){
        if (fields[i].value == "") 
            msg += 'Fill ' + fields[i].name + ' , it is required. \n';
    }
    if (textearea.value == ""){
        msg += "you can not leave comment box blank";
    }
    if(msg) {
        alert(msg);
        return false;
    }
    else
        return true;
}

function success (response) {
    $(".name-of-user").html(window.user);
    $("#contact-form").hide('slow');
    $("#thankyou").show('slow');
};

$("#myform").submit((e) => {
    e.preventDefault();
    var spinner = 'Submit <svg class="loader" aria-hidden="true" focusable="false" width="14" height="14"><path d="M13.983 6.547c-.12-2.509-1.64-4.893-3.939-5.936-2.48-1.127-5.488-.656-7.556 1.094C.524 3.367-.398 6.048.162 8.562c.556 2.495 2.46 4.52 4.94 5.183 2.932.784 5.61-.602 7.256-3.015-1.493 1.993-3.745 3.309-6.298 2.868-2.514-.434-4.578-2.349-5.153-4.84a6.226 6.226 0 0 1 2.98-6.778C6.34.586 9.74 1.1 11.373 3.493c.407.596.693 1.282.842 1.988.127.598.073 1.197.161 1.794.078.525.543 1.257 1.15.864.525-.341.49-1.05.456-1.592-.007-.15.02.3 0 0" fill-rule="evenodd"></path></svg>';
    $("#form-submit-btn").html(spinner);
    window.user = $("#firstname").val();
    if (Validate()){
        $.ajax({
            url: url,
            type: 'post',
            data:$('#myform').serialize(),
            success:(response) => {
                success(response);
            },
            error: (error) =>{
                alert(error);
            }
        });
    }
    
});