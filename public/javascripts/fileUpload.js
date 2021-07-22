FilePond.registerPlugin(
    FilePondPluginImagePreview,
    FilePondPluginImageResize,
    FilePondPluginFileEncode,
)

FilePond.setOptions({
  stylePanelAspectRatio : 140 / 150,
  imageResizeTargetWidth : 140,
  imageResizeTargetHeight : 150  
})

FilePond.parse(document.body);