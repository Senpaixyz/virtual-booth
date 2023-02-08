const form = document.querySelector('form');
const formSubmit = document.querySelector("#form-submit");
const messageContainer = document.querySelector("#message-container");
const errorTimeout = 2000;
function raiseError(message,reconnectingStatus=false){
    const errorTemplate =  `
     <span id="danger-alert" class="flex p-4 mx-4 mb-4 text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400" role="alert">
        <svg aria-hidden="true" class="flex-shrink-0 w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"></path></svg>
        <span class="sr-only">Info</span>
        <div class="ml-3 text-sm font-medium " id="danger-content">
          ${message}, Please try again!
        </div>
        <span class="ml-auto -mx-1.5 -my-1.5 bg-red-50 text-blue-500 rounded-lg focus:ring-2 focus:ring-blue-400 p-1.5 hover:bg-blue-200 inline-flex h-8 w-8 dark:bg-gray-800 dark:text-blue-400 dark:hover:bg-gray-700"></span>
      </div>
    `;

    messageContainer.innerHTML = errorTemplate;

    let timeout = setTimeout(function(){
        messageContainer.innerHTML = '';
        clearTimeout(timeout);
        if(reconnectingStatus){
            enabledSubmitButton('Reconnected, Try Again');
        }
        else{
            enabledSubmitButton('Try Again');
        }

    },errorTimeout);

}

function raiseSuccess(message){
    const successTemplate =  `
        <div id="alert-3" class="flex p-4 mx-4 mb-4 text-green-800 rounded-lg bg-green-50 dark:bg-gray-800 dark:text-green-400" role="alert">
          <svg aria-hidden="true" class="flex-shrink-0 w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"></path></svg>
          <span class="sr-only">Info</span>
          <div class="ml-3 text-sm font-medium">
            Join Success! Please click <a href="/virtual-booth" class="font-semibold underline hover:no-underline">here</a> to redirect.
          </div>
          <button type="button" class="ml-auto -mx-1.5 -my-1.5 bg-green-50 text-green-500 rounded-lg focus:ring-2 focus:ring-green-400 p-1.5 hover:bg-green-200 inline-flex h-8 w-8 dark:bg-gray-800 dark:text-green-400 dark:hover:bg-gray-700" data-dismiss-target="#alert-3" aria-label="Close">
            <span class="sr-only">Close</span>
            <svg aria-hidden="true" class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>
          </button>
        </div>
    `;

    messageContainer.innerHTML = successTemplate;

    let timeout = setTimeout(function(){
        window.location.href = '/virtual-booth';
        clearTimeout(timeout);
    },1000);


}

function enabledSubmitButton(content){
    let timeout = setTimeout(() => {
        formSubmit.classList.remove("cursor-not-allowed","opacity-50")
        formSubmit.removeAttribute('disabled')
        formSubmit.innerHTML = content
        clearTimeout(timeout);
    }, errorTimeout);
}


form.addEventListener('submit',function(e){
    e.preventDefault();


    // add spinner here..
    formSubmit.classList.add("cursor-not-allowed","opacity-50")
    formSubmit.setAttribute('disabled','disabled')
    formSubmit.innerHTML = 'Submitting...'


    const first_name = document.querySelector('#first_name');
    const last_name = document.querySelector('#last_name');
    const email = document.querySelector('#email');
    const speciality = document.querySelector("#speciality");
    const prc = document.querySelector("#prc");
    const terms_and_condition = document.querySelector("#terms_and_condition:checked");

    const formData = {
        firstName: first_name.value,
        lastName: last_name.value,
        email: email.value,
        speciality: speciality.value,
        prc: prc.value,
        terms_and_condition: terms_and_condition.checked
    };
    axios(
        {
            method: 'post',
            url: '/create',
            data: formData,
        }
    )
    .then(res => {
        console.log(res);
        if(res.data.status == 'success'){
            document.cookie = `token=${res.data.token};path=/`;
            enabledSubmitButton('Page Redirecting...')
            raiseSuccess(res.data.message);
        }
        else{
            if(res.data.hasOwnProperty('message')){
                raiseError(res.data.message);
            }
            else{
                raiseError('Reconnecting to Database...',true);
            }

        }
    })
    .catch(res =>{
        console.log(res);
        raiseError("There's something wrong while Submitting Request");
    });
});

