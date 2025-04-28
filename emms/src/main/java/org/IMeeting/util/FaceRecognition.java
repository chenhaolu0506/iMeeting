package org.IMeeting.util;

import com.arcsoft.face.*;
import com.arcsoft.face.enums.ImageFormat;

import javax.imageio.ImageIO;
import java.awt.color.ColorSpace;
import java.awt.image.BufferedImage;
import java.awt.image.ColorConvertOp;
import java.awt.image.DataBufferByte;
import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

/**
 * Created by gjw on 2019/2/3.
 */
public class FaceRecognition {

    final String APP_ID = "2q5Ymv1QbkBqp5L46toQ8cquVbU1CbiV32ApSsiwJYY5";
    final String SDK_KEY = "CKhPAJE8NjvqzyLVsmwtZqdjDHaSJbZnAtt92BuGmAp6";

    FaceEngine faceEngine = new FaceEngine();

    public FaceRecognition() {
        //激活引擎
        System.out.println("激活引擎");
        faceEngine.active(APP_ID, SDK_KEY);
        //引擎配置 支持人脸侦测与人脸识别
        System.out.println("引擎配置 支持人脸侦测与人脸识别");
        EngineConfiguration engineConfiguration = EngineConfiguration.builder().functionConfiguration(
                FunctionConfiguration.builder()
                        .supportFaceDetect(true)
                        .supportFaceRecognition(true)
                        .build()).build();
        //初始化引擎
        System.out.println("初始化引擎");
        faceEngine.init(engineConfiguration);
    }

    /*
     * @param 图片
     * @param 数据库中的人脸特征值
     * @return 相似度
     */
    public byte[] getFeatureData(File pic) {
        ImageInfo imageInfo = getRGBData(pic);

//        //激活引擎
//        faceEngine.active(APP_ID, SDK_KEY);
//        //引擎配置 支持人脸侦测与人脸识别
//        EngineConfiguration engineConfiguration = EngineConfiguration.builder().functionConfiguration(
//                FunctionConfiguration.builder()
//                        .supportFaceDetect(true)
//                        .supportFaceRecognition(true)
//                        .build()).build();
//        //初始化引擎
//        faceEngine.init(engineConfiguration);

        //人脸检测
        List<FaceInfo> faceInfoList = new ArrayList<FaceInfo>();
        faceEngine.detectFaces(imageInfo.getRgbData(), imageInfo.getWidth(), imageInfo.getHeight(), ImageFormat.CP_PAF_BGR24, faceInfoList);

        //提取人脸特征
        FaceFeature faceFeature = new FaceFeature();
        faceEngine.extractFaceFeature(imageInfo.getRgbData(), imageInfo.getWidth(), imageInfo.getHeight(), ImageFormat.CP_PAF_BGR24, faceInfoList.get(0), faceFeature);

        //返回图片中提取的人脸特征值
        return faceFeature.getFeatureData();

    }
    /*
     * @param 源人脸特征值
     * @param 目标脸特征值
     * @return 相似度
     */
    public double faceCompare(byte source[], byte target[]) {
        try{
            //人脸对比
            System.out.println("人脸对比");
            FaceFeature sourceFeature = new FaceFeature(source);
            FaceFeature targetFaceFeature = new FaceFeature(target);

            FaceSimilar faceSimilar = new FaceSimilar();
            faceEngine.compareFaceFeature(targetFaceFeature, sourceFeature, faceSimilar);

            System.out.println("人脸相似度: " + faceSimilar.getScore());
            return faceSimilar.getScore();
        }catch (Exception e){
            return -1;
        }

    }



    /**
     *获取图片数据
     */
    public ImageInfo getRGBData(File file) {
        if (file == null)
            return null;
        ImageInfo imageInfo;
        try {
            //将图片文件加载到内存缓冲区
            BufferedImage image = ImageIO.read(file);
            imageInfo = bufferedImage2ImageInfo(image);
        } catch (IOException e) {
            e.printStackTrace();
            return null;
        }
        return imageInfo;
    }

    private ImageInfo bufferedImage2ImageInfo(BufferedImage image) {
        ImageInfo imageInfo = new ImageInfo();
        int width = image.getWidth();
        int height = image.getHeight();
        // 使图片居中
        width = width & (~3);
        height = height & (~3);
        imageInfo.width = width;
        imageInfo.height = height;
        //根据原图片信息新建一个图片缓冲区
        BufferedImage resultImage = new BufferedImage(width, height, image.getType());
        //得到原图的rgb像素矩阵
        int[] rgb = image.getRGB(0, 0, width, height, null, 0, width);
        //将像素矩阵 绘制到新的图片缓冲区中
        resultImage.setRGB(0, 0, width, height, rgb, 0, width);
        //进行数据格式化为可用数据
        BufferedImage dstImage = new BufferedImage(image.getWidth(), image.getHeight(), BufferedImage.TYPE_3BYTE_BGR);
        if (resultImage.getType() != BufferedImage.TYPE_3BYTE_BGR) {
            ColorSpace cs = ColorSpace.getInstance(ColorSpace.CS_LINEAR_RGB);
            ColorConvertOp colorConvertOp = new ColorConvertOp(cs, dstImage.createGraphics().getRenderingHints());
            colorConvertOp.filter(resultImage, dstImage);
        } else {
            dstImage = resultImage;
        }

        //获取rgb数据
        imageInfo.rgbData = ((DataBufferByte) (dstImage.getRaster().getDataBuffer())).getData();
        return imageInfo;
    }


    class ImageInfo {
        public byte[] rgbData;
        public int width;
        public int height;

        public byte[] getRgbData() {
            return rgbData;
        }

        public void setRgbData(byte[] rgbData) {
            this.rgbData = rgbData;
        }

        public int getWidth() {
            return width;
        }

        public void setWidth(int width) {
            this.width = width;
        }

        public int getHeight() {
            return height;
        }

        public void setHeight(int height) {
            this.height = height;
        }
    }
}
