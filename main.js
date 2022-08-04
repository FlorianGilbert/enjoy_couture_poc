window.onload = function () {
    let form = document.querySelector('form');
    form.onsubmit = submitted.bind(form);
}

async function submitted(event) {
    event.preventDefault();
    const reader = new FileReader()

    let file = document.querySelector('#form-file').files[0];
    let divData = document.querySelector('#file-data');
    let colorValue = document.querySelector('input[name="color"]:checked').value;
    reader.onload = async (ev) => {
        let data = atob(ev.currentTarget.result.split('data:application/pdf;base64,')[1]);
        let loadingTask = pdfjsLib.getDocument({data: data});
        loadingTask.promise.then(async function (pdf) {
            let pdfDocument = new PDFDocument(file.name, pdf, colorValue);
            await pdfDocument.init();
            divData.innerHTML += pdfDocument.toString();
        }, function (reason) {
            // PDF loading error
            console.error(reason);
        });
    }
    reader.readAsDataURL(file)
}
