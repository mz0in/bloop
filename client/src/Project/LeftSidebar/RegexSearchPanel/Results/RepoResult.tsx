import React, {
  memo,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import GitHubIcon from '../../../../icons/GitHubIcon';
import { HardDriveIcon } from '../../../../icons';
import { splitPath } from '../../../../utils';
import { DirectoryEntry } from '../../../../types/api';
import { getFolderContent } from '../../../../services/api';
import RepoEntry from '../../NavPanel/Repo/RepoEntry';
import { UIContext } from '../../../../context/uiContext';
import { useEnterKey } from '../../../../hooks/useEnterKey';
import { CommandBarContext } from '../../../../context/commandBarContext';

type Props = {
  repoRef: string;
  index: string;
  isExpandable?: boolean;
  focusedIndex: string;
  setFocusedIndex: (s: string) => void;
};

const RepoResult = ({
  repoRef,
  isExpandable,
  index,
  focusedIndex,
  setFocusedIndex,
}: Props) => {
  const { isLeftSidebarFocused } = useContext(UIContext.Focus);
  const { isVisible: isCommandBarVisible } = useContext(
    CommandBarContext.General,
  );
  const [isExpanded, setIsExpanded] = useState(false);
  const [files, setFiles] = useState<DirectoryEntry[]>([]);

  const fetchFiles = useCallback(
    async (path?: string) => {
      const resp = await getFolderContent(repoRef, path);
      if (!resp.entries) {
        return [];
      }
      return resp?.entries.sort((a, b) => {
        if ((a.entry_data === 'Directory') === (b.entry_data === 'Directory')) {
          return a.name.toLowerCase() < b.name.toLowerCase() ? -1 : 1;
        } else {
          return a.entry_data === 'Directory' ? -1 : 1;
        }
      });
    },
    [repoRef],
  );

  useEffect(() => {
    if (isExpanded && !files.length) {
      fetchFiles().then(setFiles);
    }
  }, [fetchFiles, files, isExpanded]);

  const onClick = useCallback(() => {
    if (isExpandable) {
      setIsExpanded((prev) => !prev);
    }
  }, [isExpandable]);

  useEnterKey(
    onClick,
    focusedIndex !== index ||
      !isExpandable ||
      !isLeftSidebarFocused ||
      isCommandBarVisible,
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if ((e.movementX || e.movementY) && isExpandable) {
        setFocusedIndex(index);
      }
    },
    [index, setFocusedIndex, isExpandable],
  );

  return (
    <span
      className={`flex flex-col flex-shrink-0 ${
        isExpanded ? '' : 'h-10 overflow-hidden'
      }`}
    >
      <a
        href="#"
        className={`h-10 flex-shrink-0 ${
          isExpandable
            ? focusedIndex === index
              ? 'bg-bg-sub-hover'
              : 'bg-bg-sub hover:bg-bg-sub-hover'
            : 'bg-bg-sub'
        } flex items-center gap-3 px-4 body-s-b text-label-title`}
        onClick={onClick}
        onMouseMove={handleMouseMove}
        data-node-index={isExpandable ? index : undefined}
      >
        {repoRef.startsWith('github.com/') ? (
          <GitHubIcon sizeClassName="w-3 h-3" />
        ) : (
          <HardDriveIcon sizeClassName="w-3 h-3" />
        )}
        {splitPath(repoRef)
          .slice(repoRef.startsWith('github.com/') ? -2 : -1)
          .join('/')}
      </a>
      {isExpanded && (
        <div className={isExpanded ? 'overflow-auto' : 'overflow-hidden'}>
          {files.map((f, fi) => (
            <RepoEntry
              key={f.name}
              name={f.name}
              indexed={
                f.entry_data !== 'Directory' ? f.entry_data.File.indexed : true
              }
              isDirectory={f.entry_data === 'Directory'}
              level={1}
              fetchFiles={fetchFiles}
              fullPath={f.name}
              repoRef={repoRef}
              focusedIndex={focusedIndex}
              index={`${index}-${fi}`}
              lastIndex={''}
              isLeftSidebarFocused={isLeftSidebarFocused}
              isCommandBarVisible={isCommandBarVisible}
              setFocusedIndex={setFocusedIndex}
            />
          ))}
        </div>
      )}
    </span>
  );
};

export default memo(RepoResult);
