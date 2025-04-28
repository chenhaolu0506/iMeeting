package org.IMeeting.util;

import org.springframework.web.multipart.MultipartFile;

import javax.servlet.http.HttpServletResponse;
import java.io.*;

/**
 * Created by gjw on 2019/1/18.
 */

public class FileUtil {

    /**
     * @param file     文件
     * @param path     文件存放路径
     * @param fileName 原文件名
     * @return
     */
    public static boolean upload(MultipartFile file, String path, String fileName) {

        // 生成新的文件名
        String realPath = path + "/" + fileName;

        //使用原文件名
        // String realPath = path + "/" + fileName;

        File dest = new File(realPath);

        //判断文件父目录是否存在
        if (!dest.getParentFile().exists()) {
            dest.getParentFile().mkdir();
        }

        try {
            //保存文件
            file.transferTo(dest);
            return true;
        } catch (IllegalStateException e) {
            e.printStackTrace();
            return false;
        } catch (IOException e) {
            e.printStackTrace();
            return false;
        }

    }

    public void downLoad(String fileName, HttpServletResponse response) {
        InputStream is = this.getClass().getResourceAsStream("/templates/" + fileName);
        response.reset();
        response.setContentType("bin");
        response.addHeader("Content-Disposition", "attachment;fileName=" + fileName);
        BufferedReader br = new BufferedReader(new InputStreamReader(is));
        byte[] b = new byte[10240];
        int len;
        try {
            while ((len = is.read(b)) != -1) {
                response.getOutputStream().write(b, 0, len);
            }
            is.close();
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    public static File multoFile(MultipartFile mulFile)throws IOException{
        File f = null;
        if(mulFile.equals("")||mulFile.getSize()<=0){
            mulFile = null;
        }else{
            InputStream ins = mulFile.getInputStream();
            f=new File(mulFile.getOriginalFilename());
            inputStreamToFile(ins, f);
        }
        return f;
    }
    public static void inputStreamToFile(InputStream ins,File file) {
        try {
            OutputStream os = new FileOutputStream(file);
            int bytesRead = 0;
            byte[] buffer = new byte[8192];
            while ((bytesRead = ins.read(buffer, 0, 8192)) != -1) {
                os.write(buffer, 0, bytesRead);
            }
            os.close();
            ins.close();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}

