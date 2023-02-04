const form = document.querySelector('form');




form.addEventListener('submit',function(e){
    e.preventDefault();

    const first_name = document.querySelector('#first_name');
    const last_name = document.querySelector('#last_name');
    const email = document.querySelector('#email');

    const formData = {
        firstName: first_name.value,
        lastName: last_name.value,
        email: email.value
    };
    axios(
        {
            method: 'post',
            url: '/create',
            data: formData,
        }
    )
    .then(res => {
        if(res.data.status == 'success'){

        }
        else{

        }
    })
    .catch(res =>{
        console.log(res);
        window.alert(res.data.message);
    });
});
