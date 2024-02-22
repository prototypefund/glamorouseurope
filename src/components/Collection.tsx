// @ts-expect-error konsta typing
import { Block, Button, Toggle } from "konsta/react";
import { Suspense, lazy, useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { useTranslation } from "react-i18next";
import ReactLassoSelect, { getCanvas } from "react-lasso-select";

import useStore, { ImageProps } from "../store";
import useRemoveImageBackground from "../utils/useRemoveImageBackground";
import utils from "../utils/utils";
import ThumbnailSlider from "./ThumbnailSlider";

const Viewer = lazy(() => import("@samvera/clover-iiif/viewer"));

const options = {
  canvasBackgroundColor: "010A01",
  gestureSettingsTouch: {
    dragToPan: false,
    dblClickToZoom: false,
    dblClickDragToZoom: false,
    flickEnabled: false,
    pinchRotate: true,
  },
  informationPanel: {
    open: false,
  },
  openSeadragon: {
    loadTilesWithAjax: true,
    showNavigationControl: false,
    showHomeControl: false,
    showFullPageControl: false,
    showRotationControl: false,
    showFlipControl: false,
    showZoomControl: false,
  },
  showTitle: false,
  showIIIFBadge: false,
};

const customTheme = {
  colors: {
    primary: "#b990c1",
    accent: "#b990c1",
    secondary: "#EDECEA",
  },
};

function Collection() {
  const { t } = useTranslation();
  const notify = () => toast.success(t("collectionToastSuccess"));
  const { addToArtwork, imageLikeList } = useStore();

  const [selectedImage, setSelectedImage] = useState<ImageProps | null>(
    imageLikeList[0] || null,
  );
  const [activeCanvasId, setActiveCanvasId] = useState("");
  const [canvasImg, setCanvasImg] = useState("");
  const [points, setPoints] = useState<{ x: number; y: number }[]>([]);
  const [clippedImg, setClippedImg] = useState<string>("");
  const [showZoomSelect, setShowZoomSelect] = useState<boolean>(true);
  const { autoRemoveBackground } = useRemoveImageBackground();

  useEffect(() => {
    if (activeCanvasId) {
      setTimeout(() => {
        setCanvasImg(document.querySelectorAll("canvas")[0].toDataURL());
      }, 1000);
    }
  }, [activeCanvasId]);

  useEffect(() => {
    selectedImage && setCanvasImg(selectedImage?.image);
  }, [selectedImage]);

  const handleImageClick = (image: ImageProps) => {
    setSelectedImage(image);
  };

  const removeBackground = (clippedImg: string) => {
    const imageElement = new Image();
    imageElement.src = clippedImg;
    autoRemoveBackground(imageElement).then((base64: string) => {
      // console.log(base64);
      setClippedImg(base64);
    });
  };

  const addFrameToArtwork = async (id: string, imageURL: string) => {
    try {
      notify();
      if (showZoomSelect) {
        const croppedImagePath = await utils.getCroppedImagePath(imageURL);
        if (croppedImagePath) {
          addToArtwork(id, croppedImagePath);
        }
      } else {
        addToArtwork(id, imageURL);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleCanvasIdCallback = (activeCanvasId: string) => {
    if (activeCanvasId) setActiveCanvasId(activeCanvasId);
  };

  const renderLoader = () => (
    <h2 className="mt-4 text-xl">🌀 {t("collectionLoading")}</h2>
  );

  return (
    <Block
      margin={"my-4"}
      className="flex flex-col flex-wrap gap-4 container justify-center content-center text-center mx-auto"
    >
      <div className="p-2">
        <h1 className="text-xl">{t("collectionTitle")}</h1>
      </div>
      <Toaster />
      <ThumbnailSlider
        imageList={imageLikeList}
        handleImageClick={handleImageClick}
      />
      {selectedImage && (
        <Block margin={"my-0"} className="space-y-4">
          <Block
            margin={"mb-4"}
            className="flex flex-wrap gap-4 container justify-center text-center mx-auto"
          >
            <p className="text-xl self-center">{t("collectionSwitchLasso")}</p>
            <Toggle
              checked={showZoomSelect}
              onChange={() => setShowZoomSelect(!showZoomSelect)}
            />
            <p className="text-xl self-center">{t("collectionSwitchViewer")}</p>
            <Button
              className="p-4 text-xl text-black w-2/3 mx-auto h-16"
              rounded
              inline
              onClick={() =>
                showZoomSelect
                  ? addFrameToArtwork(
                      selectedImage?.id,
                      selectedImage?.identifier,
                    )
                  : addFrameToArtwork("1", clippedImg)
              }
            >
              {t("collectionAddText")}
            </Button>
          </Block>

          {showZoomSelect ? (
            <Suspense fallback={renderLoader()}>
              <Viewer
                iiifContent={selectedImage.url}
                options={options}
                customTheme={customTheme}
                canvasIdCallback={handleCanvasIdCallback}
              />
            </Suspense>
          ) : (
            <>
              <ReactLassoSelect
                value={points}
                src={canvasImg}
                onChange={(path) => {
                  setPoints(path);
                }}
                onComplete={(path) => {
                  if (!path.length) return;
                  getCanvas(canvasImg, path, (err, canvas) => {
                    if (!err) {
                      setClippedImg(canvas.toDataURL());
                    }
                  });
                }}
              />
              <div>
                {clippedImg && (
                  <Button
                    className="p-4 text-xl text-black w-2/3 mx-auto h-16"
                    rounded
                    inline
                    onClick={() => removeBackground(clippedImg)}
                  >
                    {t("collectionRemoveText")}
                  </Button>
                )}
                <img className="my-4 mx-auto" src={clippedImg} alt="" />
              </div>
            </>
          )}
        </Block>
      )}
    </Block>
  );
}

export default Collection;
