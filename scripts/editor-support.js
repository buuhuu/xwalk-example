import { decorateBlock, decorateButtons, decorateIcons, loadBlock } from './lib-franklin.js';

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
  Promise.all(updates
    .map(async (update) => {
      const { content } = update;
      const newBlockDocument = new DOMParser().parseFromString(content, 'text/html');
      const newBlock = newBlockDocument?.querySelector(`[data-aue-resource="${blockResource}"]`);
      if(newBlock) {
        newBlock.style.display = 'none';
        block.insertAdjacentElement('afterend', newBlock);
        // decorate buttons and icons
        decorateButtons(newBlock);
        decorateIcons(newBlock);
        // decorate and load the block
        decorateBlock(newBlock);
        await loadBlock(newBlock);
        // remove the old block and show the new one
        block.remove();
        newBlock.style.display = null;
        return Promise.resolve();
      }
      return Promise.reject();
    }))
    .catch(() => {
      // fallback to a full reload if any item could not be reloaded
      window.location.reload();
    });
}

document.addEventListener('aue:content-patch', handleEditorUpdate);
