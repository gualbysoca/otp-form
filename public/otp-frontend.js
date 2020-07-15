
//alert("entra...");

const phoneForm = document.querySelector('#phone-form');
const otpForm = document.querySelector('#otp-form');
//const otpField = new mdc.textField.MDCTextField(document.querySelector('#otp-field'));
const otpInput = document.querySelector('#otp-input');
const message = document.querySelector('#message');
const copy = document.querySelector('#copy');
const verify = document.querySelector('#verify');
const cancel = document.querySelector('#cancel');
const cont = document.querySelector('#continue');
const success = document.querySelector('#success');
const back = document.querySelector('#back');
const progress = document.querySelector('#progress');
const sb = document.querySelector('#snackbar');
const install = document.querySelector('#install');

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/public/sw.js');
}

const snackbarAlert = text => {
  sb.labelText = text;
  sb.show();
}

// `input[autocomplete="one-time-codep"]` polyfill
// https://gist.github.com/agektmr/67dce7e9db26c48b5ddc6811fb95d02d
if ('customElements' in window && 'OTPCredential' in window) {
  alert("entra a la funcion principal.");
  customElements.define("one-time-code",
    class extends HTMLInputElement {
      connectedCallback() {
        this.abortController = new AbortController();
        this.receive(); 
      }
      disconnectedCallback() {
        //alert("Operación abortada");
        this.abort();
      }
      abort() {
        this.abortController.abort();
      }
      async receive() {
        try {
          const content = await navigator.credentials.get({
            otp: {transport:['sms']}, signal: this.abortController.signal
          });
          this.value = content.code;
          alert("El PIN extraido es: " + this.value);
          this.dispatchEvent(new Event('autocomplete'));
        } catch (e) {
          console.error(e);
        }
      }
    }, {
      extends: "input"
  });
}

// const smsReceiver = async () => {
//   if (!window.OtpCredential) return;

//   progress.indeterminate = true;
//   try {
//     const sms = await navigator.sms.receive();
//     const code = sms.content.match(/^[\s\S]*otp=([0-9]{6})[\s\S]*$/m)[1];
//     if (code) {
//       otpField.value = code;
//       otpField.disabled = true;
//       cancel.disabled = true;
//       cont.disabled = true;
//       snackbarAlert('Verifying...');
//       setTimeout(_continue, 2500);
//     } else {
//       progress.indeterminate = false;
//       throw 'Received the SMS, but failed to retrieve the OTP.';
//     }
//   } catch (e) {
//     progress.indeterminate = false;
//     if (e.name !== 'AbortError') {
//       throw 'Failed to receive SMS';      
//     }
//   }
// };

const _copy = async e => {
  e.preventDefault();
  const range = document.createRange();
  range.selectNode(message);
  window.getSelection().removeAllRanges();
  window.getSelection().addRange(range);
  document.execCommand('copy');
  snackbarAlert('Mensaje copiado...');
}

const _verify = async e => {
  e.preventDefault();
  //otpField.disabled = false;
  phoneForm.classList.remove('visible');
  otpForm.classList.add('visible');
  success.classList.remove('visible');
};

const _continue = async e => {
  if (!otpForm.checkValidity()) {
    snackbarAlert('Por favor ingresa un código PIN válido.');
    throw 'Invalid one time code.';
  }
  progress.indeterminate = true;
  //otpField.disabled = true;
  cancel.disabled = true;
  cont.disabled = true;
  snackbarAlert('Verificando...');
  setTimeout(() => {
    progress.indeterminate = false;
    phoneForm.classList.remove('visible');
    otpForm.classList.remove('visible');
    success.classList.add('visible');    
    snackbarAlert('Tu número fue verificado, gracias!');
  }, 1500);
};

const _back = async e => {
  progress.indeterminate = false;
  //otpField.value = "";
  //otpField.disabled = false;
  cancel.disabled = false;
  cont.disabled = false;
  phoneForm.classList.add('visible');
  otpForm.classList.remove('visible');
  success.classList.remove('visible');  
};

copy.addEventListener('click', _copy);
verify.addEventListener('click', _verify);
cont.addEventListener('click', _continue);
otpInput.addEventListener('autocomplete', _continue);
cancel.addEventListener('click', _back);
back.addEventListener('click', _back);
phoneForm.addEventListener('submit', async e => e.preventDefault());
otpForm.addEventListener('submit', async e => e.preventDefault());

if (!window.OTPCredential) {
  const caution = document.querySelector('#unsupported');
  //alert("No soportado.");
  caution.classList.add('visible');
  //const newLocal = "Your browser does not support Web OTP API. To try out the API, use Google Chrome 82 or later and enable chrome://flags/#enable-experimental-web-platform-features.";
  //caution.innerHTML = newLocal;
  

}

message.innerText = `Your OTP is: 123456.

@${window.location.host} #123456`;  

window.addEventListener('beforeinstallprompt', e => {
  e.preventDefault();
  let installEvent = e;
  install.classList.remove('invisible');
  install.addEventListener('click', async () => {
    installEvent.prompt();
    // install.classList.add('invisible');
  });
});
