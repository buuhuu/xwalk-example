document.addEventListener('DOMContentLoaded', function() {
  // Create a new meta element
  const metaElement = document.createElement('meta');

  // Set the attributes for the meta element
  metaElement.setAttribute('name', 'urn:adobe:aem:editor:endpoint');
  metaElement.setAttribute('content', 'https://adobeioruntime.net/api/v1/web/53444-devlive2021-stage/universal-editor-service/edge');

  // Append the meta element to the head of the document
  document.head.appendChild(metaElement);
});
