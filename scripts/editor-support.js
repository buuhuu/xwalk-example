import {
  decorateBlock, decorateButtons, decorateIcons, loadBlock,
} from './lib-franklin.js';

const connectionPrefix = 'urn:aemconnection:';

function handleEditorUpdate(event) {
  const { detail } = event;

  const resource = detail?.requestData?.target?.resource;
  if (!resource) return;

  const element = document.querySelector(`[data-aue-resource="${resource}"]`);
  const block = element?.closest('.block');
  const blockResource = block?.getAttribute('data-aue-resource');
  if (!block || !blockResource?.startsWith(connectionPrefix)) return;

  const updates = detail?.responseData?.updates;
  if (updates.length > 0) {
    const { content } = updates[0];
    const newBlockDocument = new DOMParser().parseFromString(content, 'text/html');
    const newBlock = newBlockDocument?.querySelector(`[data-aue-resource="${blockResource}"]`);
    if (newBlock) {
      newBlock.style.display = 'none';
      block.insertAdjacentElement('afterend', newBlock);
      // decorate buttons and icons
      decorateButtons(newBlock);
      decorateIcons(newBlock);
      // decorate and load the block
      decorateBlock(newBlock);
      loadBlock(newBlock);
      // remove the old block and show the new one
      block.remove();
      newBlock.style.display = null;
    }
  }
}

document.querySelector('main')?.addEventListener('aue:content-patch', handleEditorUpdate);
