document.addEventListener('DOMContentLoaded',() =>{
    const dropZone = document.getElementById("dropZone");
    const fileInput = document.getElementById("fileInput");
    const selectButton = document.getElementById("selectButton");
    const originalImage = document.getElementById("originalImage");
    const processedImage = document.getElementById("processedImage");
    const removeBackgroundBtn = document.getElementById("removeBackground");
    const downloadBtn = document.getElementById("download");
    const loading = document.querySelector(".loading");
    //loading
    loading.style.display = "none";
    //File input
    //drag

    dropZone.addEventListener("dragover", (e) => {
      e.preventDefault();
      dropZone.classList.add("dragover");
    });

    dropZone.addEventListener("dragleave", () => {
      dropZone.classList.remove("dragover");
    });

    dropZone.addEventListener('drop', (e) => {
      e.preventDefault();
      dropZone.classList.remove("dragover");
      const file = e.dataTransfer.files[0];
      console.log(file);
      if(file && file.type.startsWith('image/')){
        //upload
        handleImageUpload(file);
      }


    });

    //select
    selectButton.addEventListener('click',()=>{
        fileInput.click();
    });
    fileInput.addEventListener('change',(e)=>{
        const file = e.target.files[0]
        if(file){
            handleImageUpload(file);
        }
    })

    //handle upload
    function handleImageUpload(file){
        const reader = new FileReader()
        
        reader.onload = (e) => {
            console.log(e.target.result);
            originalImage.src = e.target.result;
            originalImage.hidden = false;
            processedImage.hidden = true;
            removeBackgroundBtn.disabled = false;
            downloadBtn.disabled = true;
        }
        reader.readAsDataURL(file);
    }

    //remove bg
    removeBackgroundBtn.addEventListener("click", async () => {
      loading.style.display = "flex";
      try {
        
        const blob = await fetch(originalImage.src).then((r) => r.blob());
        const reader = new FileReader();
        reader.readAsDataURL(blob);

        reader.onloadend = async () => {
          const base64Image = reader.result;

          const response = await fetch("/.netlify/functions/removeBg", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ image: base64Image }),
          });

          const data = await response.json();
          processedImage.src = data.image;
          processedImage.hidden = false;
          downloadBtn.disabled = false;
          loading.style.display = "none";
        };
      } catch (err) {
        console.error(err);
        loading.style.display = "none";
      }
    });

    
    downloadBtn.addEventListener('click', ()=>{
        const link = document.createElement("a");
        link.href = processedImage.src;
        link.download = 'processed_image.png';
        link.click();
    })
})