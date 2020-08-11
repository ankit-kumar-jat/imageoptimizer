// quality Slider
window.sliderValue = 92;
document.getElementById('quality-slider').addEventListener('input', () => {
    window.sliderValue = $('#quality-slider').val();
    var sldval = window.sliderValue + " %";
    $('.slider-value').html(sldval);
});



'use strict';

;( function ( document, window, index )
{
    // feature detection for drag&drop upload
    var isAdvancedUpload = function()
        {
            var div = document.createElement( 'div' );
            return ( ( 'draggable' in div ) || ( 'ondragstart' in div && 'ondrop' in div ) ) && 'FormData' in window && 'FileReader' in window;
        }();


    // applying the effect for every form
    var forms = document.querySelectorAll( '.box' );
    var previewImg = document.querySelector('.preview-img');
    var previewText = document.querySelector('.preview-text');
    Array.prototype.forEach.call( forms, function( form )
    {
        var input		 = form.querySelector( 'input[type="file"]' ),
            label		 = form.querySelector( 'label' ),
            errorMsg	 = form.querySelector( '.box_error span' ),
            restart		 = form.querySelectorAll( '.box_restart' ), 
            droppedFiles = false,
            showFiles	 = function( files ){
                // if (files.length < 1){
                    if((files[0].size/1000) < 5000){
                        //(input.getAttribute( 'data-multiple-caption' ) || '' ).replace( '{count}', files.length ) to show multiple files put it on next line
                        label.textContent = files.length > 1 ? ( alert("Only one file can be selected at a time"), file[0].name) : files[ 0 ].name;
                        if (files.length > 0){
                            label.setAttribute("class", "image-name");
                        }
                        $('.box-button').show();
                        var file = files[0];
                        if (file){
                            const reader = new FileReader();
                            previewText.style.display = 'none';
                            previewImg.style.display = 'block';
                            reader.addEventListener('load', () => {
                                previewImg.setAttribute('src', reader.result);
                            });
                            reader.readAsDataURL(file);
                        }
                    }else{
                        alert("Please choose file less than 5Mb")
                    }
                // }else{
                //     alert("Please upload one file at a time.");
                // }
                // console.log(files);
            };
        input.addEventListener( 'change', function( e ){
            showFiles( e.target.files );
        });

        // drag&drop files if the feature is available
        var dropArea = document.querySelector('#dropArea');
        if( isAdvancedUpload ){
            form.classList.add( 'has-advanced-upload' ); // letting the CSS part to know drag&drop is supported by the browser

            [ 'drag', 'dragstart', 'dragend', 'dragover', 'dragenter', 'dragleave', 'drop' ].forEach( function( event ){
                form.addEventListener( event, function( e ){
                    // preventing the unwanted behaviours
                    e.preventDefault();
                    e.stopPropagation();
                });
            });
            [ 'dragover', 'dragenter' ].forEach( function( event ){
                form.addEventListener( event, function(){
                    dropArea.classList.add( 'is-dragover' );
                });
            });
            [ 'dragleave', 'dragend', 'drop' ].forEach( function( event ){
                form.addEventListener( event, function(){
                    dropArea.classList.remove( 'is-dragover' );
                });
            });
            form.addEventListener( 'drop', function( e ){
                droppedFiles = e.dataTransfer.files; // the files that were dropped
                showFiles( droppedFiles );
            });
        }
        // if the form was submitted
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            $('.input-area').addClass('is-uploading');
            $('.upload-bar').show('fast');
            var formData = new FormData();
            formData.append("image", input.files[0], input.files[0].name);
                var settings = {
                    xhr: function(){
                        var xhr = new window.XMLHttpRequest();
                        //Upload progress
                        xhr.upload.addEventListener("progress", function(evt){
                            if (evt.lengthComputable) {
                                var percentComplete = (evt.loaded / evt.total*100).toFixed(2) + '%';
                                $('.upload-bar-fill').css('width', percentComplete);
                                $('.upload-bar-text').html(percentComplete);
                            }
                        }, false);
                        return xhr;
                    },
                    "url": "https://api.imgbb.com/1/upload?expiration=900&key=6c85110ba0694a845b5a15496dd035c4",
                    "method": "POST",
                    "timeout": 0,
                    "processData": false,
                    "mimeType": "multipart/form-data",
                    "contentType": false,
                    "data": formData
                };
                $.ajax(settings).done(function (response) {
                    var respData = JSON.parse(response);
                    if (respData.success){
                        var successNote = "Upload Completed !"
                        $('.success-note').html(successNote);
                        window.src_size = respData.data.size;
                        window.imageUrl = respData.data.image.url;
                        // console.log(window.imageUrl);
                        $('.upload-bar').hide('slow');
                        $('.drop-section').hide();
                        $('.optimize').show();
                    }
                    })
                .fail(function(response) {
                    console.log(response.responseText);
                    alert("There is a network error while uploading Please try again. It can be happened due to wrong file format");
                    location.reload();
                    // $('.input-area').removeClass('is-uploading');
                    // $('.upload-bar').hide('fast');
                });
        });
    });
    function optimize(requestUrl){

        // ajax for image optimization
        var settings = {
            "url": requestUrl,
            "method": "POST",
            "timeout": 0,
            "headers": {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            "data": {
                "url": window.imageUrl,
                "quality": window.quality,
                "exif_data": window.exif_data
            }
        };
        $.ajax(settings).done(function (response) {
            if (response.error){
                alert(response.error_long);
                location.reload();
            }else{
                var respData = response;
            // console.log(respData);
            $('.preview-opt-img').attr('src', respData.dest);
            window.download_url = respData.dest;
            $('.preview-opt-img').show('slow');
            $('.loader').hide();
            $('.optimize-input').hide();
            var src_size = (window.src_size/1000).toFixed(2);
            var dest_size = (respData.dest_size/1000).toFixed(2);
            if (src_size > 1000){
                src_size = (src_size/1000).toFixed(2) + ' Mb';
                dest_size = (dest_size/1000).toFixed(2) + ' Mb';
            }else{
                src_size = src_size + ' Kb';
                dest_size = dest_size + ' Kb';
            }
            if (respData.percent != 0){
                var percent = respData.percent + ' %';
                $('.src_size').html(src_size);
                $('.dest_size').html(dest_size);
                $('.percent').html(percent);
                $('.expires').html(respData.expires)
                $('.optimize-info').show('slow');
            }else{
                var message = '<h4>No need of optimization, Image already optimized.</h4>';
                $('.opt-info').html(message);
                $('.optimize-info').show('slow');
            }
            }
        })
        .fail(function() {
            alert("There is an error while connectiong to optimization server, Please try again.");
            location.reload();
        });
    }
    $('#optimize-btn').click( function (){
        $('#optimize-btn').hide();
        $('#opt-preview-text').hide();
        $('.loader').show();
        // console.log("clicked");
        requestUrl = "https://api-for-image-optimizer.glitch.me/"
        if(window.sliderValue != 92){
            window.quality =  window.sliderValue;
        }
        if($('#exif-data-checkbox').is(':checked')){
            window.exif_data = 1;
        }
        optimize(requestUrl);
    });
}( document, window, 0 ));

// download feature
function forceDownload(blob, filename) {
    var a = document.createElement('a');
    var filenameArray = filename.split('.');
    var newFilename = filenameArray[0] + '-optimized.' + filenameArray[1]; 
    a.download = newFilename;
    a.href = blob;

    document.body.appendChild(a);
    a.click();
    a.remove();
}
  
  // Current blob size limit is around 500MB for browsers
function downloadResource(url, filename) {
    if (!filename) filename = url.split('\\').pop().split('/').pop();
    fetch(url, {
        headers: new Headers({
          'Origin': location.origin
        }),
        mode: 'cors'
    })
    .then(response => response.blob())
    .then(blob => {
        let blobUrl = window.URL.createObjectURL(blob);
        forceDownload(blobUrl, filename);
    })
    .catch(e => console.error(e));
}
$(".down-btn").click(() => {
    downloadResource(window.download_url);
});