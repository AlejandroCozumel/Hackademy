let ImgName, ImgURL;
let files = [];
let reader;

document.getElementById("select").onclick = function(e){

    let input = document.createElement('input');
    input.type = 'file';

    input.onchange = e => {
        files = e.target.files;
        reader = new FileReader();
        reader.onload = function(){
            document.getElementById("myimg").src = reader.result;
        }
        reader.readAsDataURL(files[0]);
    }
    input.click();
}

//UPLOAD BUTTON

document.getElementById('upload').onclick = function(){
    ImgName = document.getElementById("namebox").value;
    let uploadTask = firebase.storage().ref("img/"+ImgName+".png").put(files[0]);

    uploadTask.on('state_changed', function(snapshot){
        let progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        document.getElementById('UpProgress').innerHTML = 'Upload' + progress + '%';
    },
    function(error){
        alert('error in saving image');

    },
    function(){
        uploadTask.snapshot.ref.getDownloadURL().then(function(url){
            ImgURL = url;
        
        firebase.database().ref('Pictures/' + ImgName).set({
            Name: ImgName,
            Link: ImgURL
        });
        });
    });
}

$(document).ready(function(){
    ImgURL = "gs://restaurante-hackademy.appspot.com/img/Guacamole.png"
    const database = firebase.database();
    const beforeQuery = database.ref('menu/');

    //NOTIFICATION
    const notifications = (message) =>
    {
        if(message == 'fillall')
        {
            $('.fillall').fadeIn(1000);
                setTimeout(function(){
                    $('.fillall').fadeOut(1000);
                },3500)
        }
        if(message == 'inserted')
        {
            $('.inserted').fadeIn(1000);
                setTimeout(function(){
                    $('.inserted').fadeOut(1000);
                },3500)
        }
        if(message == 'updated')
        {
            $('.updated').fadeIn(1000);
                setTimeout(function(){
                    $('.updated').fadeOut(1000);
                },3500)
        }
    }

    // ADDING DISHES
    $('[name=submit]').click(function(e){
        e.preventDefault();

        const category = $('[name=category]').val(),
            title = $('[name=title]').val(),
            price = $('[name=price]').val(),
            image = $('[name=image]').val().slice(12),
            newid = beforeQuery.push();

            if(!title || !price || !image)
            {
                notifications("fillall");
            }
            else
            {
                newid.set({
                    category : category,
                        title : title,
                        price : price,
                        image : "img/" + image
                },
                function(error){
                    if (!error)
                    {
                        notifications("inserted");
                        $('[name=title]').val("");
                        $('[name=price]').val("");
                        $('[name=image]').val("");
                    }
                    else
                    {
                        console.log("Informacion no guardada");
                    }
                })
            }
    });

    // DATABASE

    beforeQuery.on('value', function success(data)
    {
        if(data)
        {
            let starters = '',
                main = '',
                side = '',
                dessert = '';
        $.each(data.val(),function(key,value){
            let id = key,
             category = value['category'],
                title = value['title'],
                price = value['price'],
                image = value['image'];
            
            if(category == 'starters')
            {
                starters += `<div class="product-box">
                            <div id = ${key}>
                            <img class="image" src=${ImgURL}>
                            <div class="title">${title}</div>
                            <div class="price">$ ${parseInt(price)}</div><br>
                            <div data-id=${key} class="delete"></div>
                            <div data-id=${key} class="update"></div>
                            </div>
                            </div>`;
            }
            else if (category == 'main')
            {
                main += `<div class="product-box">
                            <div id = ${key}>
                            <img class="image" src=${ImgURL}>
                            <div class="title">${title}</div>
                            <div class="price">$ ${parseInt(price)}</div><br>
                            <div data-id=${key} class="delete"></div>
                            <div data-id=${key} class="update"></div>
                            </div>
                            </div>`;
            }
            else if (category == 'side')
            {
                side += `<div class="product-box">
                            <div id = ${key}>
                            <img class="image" src=${ImgURL}>
                            <div class="title">${title}</div>
                            <div class="price">$ ${parseInt(price)}</div><br>
                            <div data-id=${key} class="delete"></div>
                            <div data-id=${key} class="update"></div>
                            </div>
                            </div>`;
            }
            else if (category == 'dessert')
            {
                dessert += `<div class="product-box">
                            <div id = ${key}>
                            <img class="image" src=${ImgURL}>
                            <div class="title">${title}</div>
                            <div class="price">$ ${parseInt(price)}</div><br>
                            <div data-id=${key} class="delete"></div>
                            <div data-id=${key} class="update"></div>
                            </div>
                            </div>`;
            }else{}
        });

        $('.starters').html(starters);
        $('.main').html(main);
        $('.side').html(side);
        $('.dessert').html(dessert);

    // DELETE FROM DATABASE

    $('.delete').click(function(){
        let thekey = $(this).data('id');
        beforeQuery.child(thekey).remove();
    });

    // UPDATE FROM DATABASE

$('#close-update').click(function(){
    $('#for-update').slideUp();
});

$('.update').click(function(){
    let thekey = $(this).data('id');
    $('#for-update').slideDown();
    let oldtitle = $(`#${thekey} > .title`).text(),
        oldprice = $(`#${thekey} > .price`).text(),
            slice = oldprice.indexOf('.');
        oldprice = oldprice.slice(0,slice); 

    $('[name=newtitle]').val(oldtitle);
    $('[name=newprice]').val(parseFloat(oldprice).toFixed(2));
    $('[name=id]').val(thekey);

    $('[name=update]').click(function(e){
        e.preventDefault();
            let theid = $('[name=id]').val();
            newtitle = $('[name=newtitle]').val();
            newprice = $('[name=newprice]').val();

        beforeQuery.child(theid).update({
            title : newtitle,
            price : newprice,
        },function(error)
        {
            if(!error)
            {
                notifications('updated');
                $('#for-update').slideUp();
            }else{}
        });
    });
});




    
    }else{console.log('No data found')}
    
    });
});
