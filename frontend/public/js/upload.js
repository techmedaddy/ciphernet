document.addEventListener('DOMContentLoaded', () => {
    const dropZone = document.getElementById('dropZone');

    dropZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropZone.classList.add('dragging');
    });

    dropZone.addEventListener('dragleave', () => {
        dropZone.classList.remove('dragging');
    });

    dropZone.addEventListener('drop', async (e) => {
        e.preventDefault();
        dropZone.classList.remove('dragging');

        const files = e.dataTransfer.files;
        if (files.length > 0) {
            const formData = new FormData();
            formData.append('file', files[0]);

            try {
                const response = await fetch('/api/files/upload', {
                    method: 'POST',
                    body: formData,
                });
                const data = await response.json();
                alert(data.message || 'File uploaded successfully!');
            } catch (error) {
                console.error('File upload failed:', error);
                alert('Error uploading file.');
            }
        }
    });
});
