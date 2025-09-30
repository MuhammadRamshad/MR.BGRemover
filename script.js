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
      console.log(e);
      

    });

    
})