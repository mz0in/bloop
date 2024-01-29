import React, { memo, useCallback, useContext } from 'react';
import { DocPageType } from '../../../../types/api';
import { TabsContext } from '../../../../context/tabsContext';
import { TabTypesEnum } from '../../../../types/general';
import { useEnterKey } from '../../../../hooks/useEnterKey';
import { FileIcon } from '../../../../icons';

type Props = DocPageType & {
  index: string;
  focusedIndex: string;
  isLeftSidebarFocused: boolean;
  isCommandBarVisible: boolean;
  favicon?: string;
  setFocusedIndex: (s: string) => void;
};

const DocEntry = ({
  index,
  focusedIndex,
  isLeftSidebarFocused,
  isCommandBarVisible,
  doc_id,
  doc_title,
  relative_url,
  favicon,
  setFocusedIndex,
}: Props) => {
  const { openNewTab } = useContext(TabsContext.Handlers);

  const handleClick = useCallback(() => {
    openNewTab({
      type: TabTypesEnum.DOC,
      title: doc_title,
      docId: doc_id,
      favicon,
      relativeUrl: relative_url,
    });
  }, [openNewTab, doc_id, doc_title, favicon, relative_url]);

  useEnterKey(
    handleClick,
    focusedIndex !== index || !isLeftSidebarFocused || isCommandBarVisible,
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (e.movementX || e.movementY) {
        setFocusedIndex(index);
      }
    },
    [index, setFocusedIndex],
  );

  return (
    <a
      href="#"
      className={`w-full text-left h-7 flex-shrink-0 flex items-center gap-3 pr-2 cursor-pointer
        ellipsis body-mini group pl-10.5 ${
          focusedIndex === index
            ? 'bg-bg-sub-hover text-label-title'
            : 'text-label-base'
        }`}
      onClick={handleClick}
      onMouseMove={handleMouseMove}
      data-node-index={index}
    >
      <FileIcon sizeClassName="w-3.5 h-3.5" />
      <span className="ellipsis">{doc_title}</span>
    </a>
  );
};

export default memo(DocEntry);
