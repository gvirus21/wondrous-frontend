import React from 'react';
import { SafeImage } from '../../Common/Image';
import DeleteIcon from '../../Icons/delete';
import { Filename, MediaItemWrapper } from './styles';
import VideoPlayer from './VideoPlayer';

export const MediaItem = (props) => {
  const { mediaItem, setMediaUploads, mediaUploads, removeMediaItem, viewOnly, className } = props;
  return (
    <MediaItemWrapper className={className}>
      {mediaItem?.type === 'image' && (
        <SafeImage
          src={mediaItem?.uploadSlug || mediaItem?.slug}
          style={{
            borderRadius: '4px',
            position: 'relative',
            left: '0',
            height: '40px',
          }}
        />
      )}
      {mediaItem?.type === 'video' && (
        <VideoPlayer
          src={mediaItem?.uploadSlug || mediaItem?.slug}
          name={mediaItem?.name}
          style={{ width: '10%', height: '10%' }}
        />
      )}
      <Filename>{mediaItem?.name}</Filename>
      {!viewOnly && (
        <DeleteIcon
          style={{
            width: '30',
          }}
          onClick={() => {
            const newMediaUploads = mediaUploads.filter((mediaUpload) => {
              return mediaUpload.uploadSlug !== mediaItem?.uploadSlug && mediaUpload?.uploadSlug !== mediaItem?.slug;
            });
            setMediaUploads(newMediaUploads);
            if (removeMediaItem) {
              removeMediaItem();
            }
          }}
        />
      )}
    </MediaItemWrapper>
  );
};
