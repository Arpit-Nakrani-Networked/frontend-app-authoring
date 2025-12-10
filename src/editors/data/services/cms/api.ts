import type { AxiosRequestConfig } from 'axios';
import { camelizeKeys } from '../../../utils';
import { isLibraryKey } from '../../../../generic/key-utils';
import * as urls from './urls';
import { get, post, deleteObject } from './utils';
import { durationStringFromValue } from '../../../containers/VideoEditor/components/VideoSettingsModal/components/DurationWidget/hooks';

const fetchByUnitIdOptions: AxiosRequestConfig = {};

interface Pagination {
  start: number;
  end: number;
  page: number;
  pageSize: number;
  totalCount: number;
}

interface AssetResponse {
  assets: Record<string, string>[]; // In the raw response here, these are NOT camel-cased yet.
}

type FieldsResponse = {
  display_name: string; // In the raw response here, these are NOT camel-cased yet.
  data: any;
  metadata: Record<string, any>;
} & Record<string, any>; // In courses (but not in libraries), there are many other fields returned here.

interface AncestorsResponse {
  ancestors: {
    id: string;
    display_name: string; // In the raw response here, these are NOT camel-cased yet.
    category: string;
    has_children: boolean;
  }[];
}

export const loadImage = (imageData) => ({
  ...imageData,
  dateAdded: new Date(imageData.dateAdded.replace(' at', '')).getTime(),
});

export const loadImages = (rawImages) => camelizeKeys(rawImages).reduce(
  (obj, image) => ({ ...obj, [image.id]: loadImage(image) }),
  {},
);

export const parseYoutubeId = (src: string): string | null => {
  if (!src) return null;

  try {
    const url = new URL(src);

    // Vimeo: return the full url directly
    if (url.hostname.includes("vimeo.com")) {
      return src;
    }

    // YouTube: extract ID from any type of YT URL
    const youtubeRegex =
      /(?:v=|\/embed\/|\/v\/|youtu\.be\/|\/shorts\/)([a-zA-Z0-9_-]{11})/;

    const match = src.match(youtubeRegex);
    return match ? match[1] : null;
  } catch {
    // If it's not a valid URL (likely a raw YouTube ID), return as-is
    if (/^[a-zA-Z0-9_-]{11}$/.test(src)) {
      return src;
    }
    return null;
  }
};


export const parseYoutubeIdOnly = (src: string): string | null => {
  if (!src) return null;

  try {
    const url = new URL(src);

    // YouTube: extract ID from any type of YT URL
    const youtubeRegex =
      /(?:v=|\/embed\/|\/v\/|youtu\.be\/|\/shorts\/)([a-zA-Z0-9_-]{11})/;

    const match = src.match(youtubeRegex);
    return match ? match[1] : null;
  } catch {
    // If it's not a valid URL (likely a raw YouTube ID), return as-is
    if (/^[a-zA-Z0-9_-]{11}$/.test(src)) {
      return src;
    }
    return null;
  }
};


export const processVideoIds = ({
  videoId,
  videoUrl,
  fallbackVideos,
}: { videoId: string, videoUrl: string, fallbackVideos: string[] }) => {
  let youtubeId: string | null = '';
  const html5Sources: string[] = [];

  if (videoUrl) {
    if (parseYoutubeIdOnly(videoUrl)) {
      youtubeId = parseYoutubeId(videoUrl);
    } else {
      html5Sources.push(videoUrl);
    }
  }

  if (fallbackVideos) {
    fallbackVideos.forEach((src) => (src ? html5Sources.push(src) : null));
  }

  return {
    edxVideoId: videoId,
    html5Sources,
    youtubeId,
  };
};

export const isEdxVideo = (src: string): boolean => {
  const uuid4Regex = /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/;
  if (src && src.match(uuid4Regex)) {
    return true;
  }
  return false;
};

export const processLicense = (licenseType, licenseDetails) => {
  if (licenseType === 'creative-commons') {
    return 'creative-commons: ver=4.0'.concat(
      (licenseDetails.attribution ? ' BY' : ''),
      (licenseDetails.noncommercial ? ' NC' : ''),
      (licenseDetails.noDerivatives ? ' ND' : ''),
      (licenseDetails.shareAlike ? ' SA' : ''),
    );
  }
  if (licenseType === 'all-rights-reserved') {
    return 'all-rights-reserved';
  }
  return '';
};

export const apiMethods = {
  fetchBlockById: ({ blockId, studioEndpointUrl }): Promise<{ data: FieldsResponse }> => get(
    urls.block({ blockId, studioEndpointUrl }),
  ),
  /** A better name for this would be 'get ancestors of block' */
  fetchByUnitId: ({ blockId, studioEndpointUrl }): Promise<{ data: AncestorsResponse }> => get(
    urls.blockAncestor({ studioEndpointUrl, blockId }),
    fetchByUnitIdOptions,
  ),
  fetchStudioView: ({ blockId, studioEndpointUrl }) => get(
    urls.blockStudioView({ studioEndpointUrl, blockId }),
  ),
  fetchImages: ({
    learningContextId,
    studioEndpointUrl,
    pageNumber,
  }): Promise<{ data: AssetResponse & Pagination }> => {
    if (isLibraryKey(learningContextId)) {
      // V2 content libraries don't support static assets yet:
      return Promise.resolve({
        data: {
          assets: [], start: 0, end: 0, page: 0, pageSize: 50, totalCount: 0,
        },
      });
    }
    const params = {
      asset_type: 'Images',
      page: pageNumber,
    };
    return get(
      `${urls.courseAssets({ studioEndpointUrl, learningContextId })}`,
      { params },
    );
  },
  fetchVideos: ({ studioEndpointUrl, learningContextId }) => get(
    urls.courseVideos({ studioEndpointUrl, learningContextId }),
  ),
  fetchCourseDetails: ({ studioEndpointUrl, learningContextId }) => get(
    urls.courseDetailsUrl({ studioEndpointUrl, learningContextId }),
  ),
  fetchAdvancedSettings: ({ studioEndpointUrl, learningContextId }) => get(
    urls.courseAdvanceSettings({ studioEndpointUrl, learningContextId }),
  ),
  uploadAsset: ({
    learningContextId,
    studioEndpointUrl,
    asset,
  }) => {
    const data = new FormData();
    data.append('file', asset);
    return post(
      urls.courseAssets({ studioEndpointUrl, learningContextId }),
      data,
    );
  },
  uploadThumbnail: ({
    studioEndpointUrl,
    learningContextId,
    videoId,
    thumbnail,
  }) => {
    const data = new FormData();
    data.append('file', thumbnail);
    return post(
      urls.thumbnailUpload({ studioEndpointUrl, learningContextId, videoId }),
      data,
    );
  },
  checkTranscriptsForImport: ({
    studioEndpointUrl,
    blockId,
    youTubeId,
    videoId,
  }) => {
    const getJSON = `{"locator":"${blockId}","videos":[{"mode":"youtube","video":"${youTubeId}","type":"youtube"},{"mode":"edx_video_id","type":"edx_video_id","video":"${videoId}"}]}`;
    return get(
      urls.checkTranscriptsForImport({
        studioEndpointUrl,
        parameters: encodeURIComponent(getJSON),
      }),
    );
  },
  importTranscript: ({
    studioEndpointUrl,
    blockId,
    youTubeId,
  }) => {
    const getJSON = `{"locator":"${blockId}","videos":[{"mode":"youtube","video":"${youTubeId}","type":"youtube"}]}`;
    return get(
      urls.replaceTranscript({
        studioEndpointUrl,
        parameters: encodeURIComponent(getJSON),
      }),
    );
  },
  getTranscript: ({
    studioEndpointUrl,
    language,
    blockId,
    videoId,
  }) => {
    const getJSON = { data: { lang: language, edx_video_id: videoId } };
    return get(
      `${urls.videoTranscripts({ studioEndpointUrl, blockId })}?language_code=${language}`,
      getJSON,
    );
  },

  deleteTranscript: ({
    studioEndpointUrl,
    language,
    blockId,
    videoId,
  }) => {
    const deleteJSON = { data: { lang: language, edx_video_id: videoId } };
    return deleteObject(
      urls.videoTranscripts({ studioEndpointUrl, blockId }),
      deleteJSON,
    );
  },
  uploadTranscript: ({
    blockId,
    studioEndpointUrl,
    transcript,
    videoId,
    language,
    newLanguage = null,
  }) => {
    const data = new FormData();
    data.append('file', transcript);
    data.append('edx_video_id', videoId);
    data.append('language_code', language);
    data.append('new_language_code', newLanguage || language);
    return post(
      urls.videoTranscripts({ studioEndpointUrl, blockId }),
      data,
    );
  },
  normalizeContent: ({
    blockId,
    blockType,
    content,
    learningContextId,
    title,
  }: {
    blockId: string,
    blockType: string,
    content: any, // string for 'html' blocks, otherwise Record<string, any>
    learningContextId: string,
    title: string,
  }) => {
    let response = {};
    if (blockType === 'html') {
      response = {
        category: blockType,
        courseKey: learningContextId,
        data: content,
        has_changes: true,
        id: blockId,
        metadata: { display_name: title },
      };
    } else if (blockType === 'problem') {
      response = {
        data: content.olx,
        category: blockType,
        courseKey: learningContextId,
        has_changes: true,
        id: blockId,
        metadata: { display_name: title, ...content.settings },
      };
    } else if (blockType === 'scorm') {
      response = {
        file: content.file || undefined,
        display_name: content.display_name,
        has_score: content.has_score ? 1 : 0,
        enable_navigation_menu: content.enable_navigation_menu ? 1 : 0,
        enable_fullscreen_button: content.enable_fullscreen_button ? 1 : 0,
        weight: content?.weight || 10.0,
        width: content.width || '',
        height: content.height || '',
        navigation_menu_width: content.navigation_menu_width || '',
        popup_on_launch: content.popup_on_launch ? 1 : 0,
      };
    } else if (blockType === 'video') {
      const {
        html5Sources,
        edxVideoId,
        youtubeId,
      } = processVideoIds({
        videoId: content.videoId,
        videoUrl: content.videoSource,
        fallbackVideos: content.fallbackVideos,
      });
      response = {
        category: blockType,
        courseKey: learningContextId,
        display_name: title,
        id: blockId,
        metadata: {
          display_name: title,
          download_video: content.allowVideoDownloads,
          public_access: content.allowVideoSharing.value,
          edx_video_id: edxVideoId,
          html5_sources: html5Sources,
          youtube_id_1_0: youtubeId,
          thumbnail: content.thumbnail,
          download_track: content.allowTranscriptDownloads,
          track: '', // TODO Downloadable Transcript URL. Backend expects a file name, for example: "something.srt"
          show_captions: content.showTranscriptByDefault,
          handout: content.handout,
          start_time: durationStringFromValue(content.duration.startTime),
          end_time: durationStringFromValue(content.duration.stopTime),
          license: processLicense(content.licenseType, content.licenseDetails),
        },
      };
    } else {
      throw new TypeError(`No Block in V2 Editors named /"${blockType}/", Cannot Save Content.`);
    }
    return { ...response };
  },
  saveBlock: ({
    blockId,
    blockType,
    content,
    learningContextId,
    studioEndpointUrl,
    title,
  }) => {
    const normalizedContent = apiMethods.normalizeContent({
      blockType,
      content,
      blockId,
      learningContextId,
      title,
    }) as any;

    // Use FormData for SCORM blocks
    if (blockType === 'scorm') {
      const formData = new FormData();

      // Append file if it exists
      if (normalizedContent.file) {
        formData.append('file', normalizedContent.file);
      }else{
        formData.append('file', normalizedContent?.file);
      }

      // Append other fields
      formData.append('display_name', normalizedContent.display_name);
      formData.append('has_score', String(normalizedContent.has_score));
      formData.append('enable_navigation_menu', String(normalizedContent.enable_navigation_menu));
      formData.append('enable_fullscreen_button', String(normalizedContent.enable_fullscreen_button));
      formData.append('weight', normalizedContent.weight);
      formData.append('width', normalizedContent.width);
      formData.append('height', String(normalizedContent.height));
      formData.append('navigation_menu_width', normalizedContent.navigation_menu_width);
      formData.append('popup_on_launch', String(normalizedContent.popup_on_launch));

      return post(
        urls.block({ studioEndpointUrl, blockId,isScorm:true }),
        formData,
      );
    }

    // Use regular JSON for other block types
    return post(
      urls.block({ studioEndpointUrl, blockId }),
      normalizedContent,
    );
  },
  fetchVideoFeatures: ({
    studioEndpointUrl,
  }) => get(
    urls.videoFeatures({ studioEndpointUrl }),
  ),
  uploadVideo: ({
    data,
    studioEndpointUrl,
    learningContextId,
  }) => post(
    urls.courseVideos({ studioEndpointUrl, learningContextId }),
    data,
  ),
};

export default apiMethods;
