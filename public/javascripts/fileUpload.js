const rootStyles = window.getComputedStyle(document.documentElement);


if (rootStyles.getPropertyValue('--image-view-width-large') != null && rootStyles.getPropertyValue('--image-view-width-large') !== '') {
  ready();
} else {
  document.getElementById('main-css').addEventListener('load', ready);
  //document.getElementById("addFieldButton").addEventListener('click',ready);
}

function ready() {
  const imgWidth = parseFloat(rootStyles.getPropertyValue('--image-view-width-large'))
  const aspectRatio = parseFloat(rootStyles.getPropertyValue('--image-view-aspect-ratio'))
  const imgHeight = imgWidth / aspectRatio

  FilePond.registerPlugin(
    FilePondPluginImagePreview,
    FilePondPluginImageResize,
    FilePondPluginFileEncode,
    FilePondPluginImageTransform  
  )

  FilePond.setOptions({
    allowImageResize : true,
    imageResizeMode : 'cover',
    stylePanelAspectRatio : 1 / aspectRatio,
    imageResizeTargetWidth : imgWidth,
    imageResizeTargetHeight : imgHeight,
    credits : false
  })

  FilePond.parse(document.body);
}

