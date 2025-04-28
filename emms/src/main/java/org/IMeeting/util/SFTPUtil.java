package org.IMeeting.util;

/**
 * Created by gjw on 2019/4/30.
 */

import com.jcraft.jsch.*;
import org.apache.commons.io.IOUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.*;
import java.util.Properties;
import java.util.Vector;

/**
 * 类说明 sftp⼯工具类
 */
public class SFTPUtil {
    private transient Logger log = LoggerFactory.getLogger(this.getClass());
    private ChannelSftp sftp;
    private Session session;
    /**
     * SFTP 登录⽤用户名
     */
    private String username;
    /**
     * SFTP 登录密码
     */
    private String password;
    /**
     * 私钥
     */
    private String privateKey;
    /**
     * SFTP 服务器器地址IP地址
     */
    private String host;
    /**
     * SFTP 端⼝口
     */
    private int port;

    /**
     * 构造基于密码认证的sftp对象
     */
    public SFTPUtil(String username, String password, String host, int port) {
        this.username = username;
        this.password = password;
        this.host = host;
        this.port = port;
    }

    /**
     * 构造基于秘钥认证的sftp对象
     */
    public SFTPUtil(String username, String host, int port, String privateKey) {
        this.username = username;
        this.host = host;
        this.port = port;
        this.privateKey = privateKey;
    }

    public SFTPUtil() {
    }

    /**
     * 连接sftp服务器器
     */
    public void login() {
        try {
            JSch jsch = new JSch();
            if (privateKey != null) {
                jsch.addIdentity(privateKey);// 设置私钥
            }

            session = jsch.getSession(username, host, port);

            if (password != null) {
                session.setPassword(password);
            }
            Properties config = new Properties();
            config.put("StrictHostKeyChecking", "no");

            session.setConfig(config);
            session.connect();

            Channel channel = session.openChannel("sftp");
            channel.connect();

            sftp = (ChannelSftp) channel;
        } catch (JSchException e) {
            e.printStackTrace();
        }
    }

    //

    /**
     * 关闭连接 server
     */

    public void logout() {
        if (sftp != null) {
            if (sftp.isConnected()) {
                sftp.disconnect();
            }
        }
        if (session != null) {
            if (session.isConnected()) {
                session.disconnect();
            }
        }
    }

    /**
     * 将输⼊入流的数据上传到sftp作为⽂文件。⽂文件完整路路径=basePath+directory * @param basePath 服务器器的基础路路径
     *
     * @param directory    上传到该⽬目录
     * @param sftpFileName sftp端⽂文件名
     * @param in           输⼊入流
     */
    public void upload(String basePath, String directory, String sftpFileName, InputStream input) throws SftpException {
        try {
            sftp.cd(basePath);
            sftp.cd(directory);
        } catch (SftpException e) {
            //目录不存在，则创建文件夹
            String[] dirs = directory.split("/");
            String tempPath = basePath;
            for (String dir : dirs) {
                if (null == dir || "".equals(dir)) continue;
                tempPath += "/" + dir;
                try {
                    sftp.cd(tempPath);
                } catch (SftpException ex) {
                    sftp.mkdir(tempPath);
                    sftp.cd(tempPath);
                }
            }
        }
        sftp.put(input, sftpFileName);  //上传文件
    }

    /**
     * 下载⽂文件。
     *
     * @param directory    下载⽬目录
     * @param downloadFile 下载的⽂文件 * @param saveFile 存在本地的路路径
     */
    public void download(String directory, String downloadFile, String saveFile) throws SftpException, FileNotFoundException {
        if (directory != null && !"".equals(directory)) {
            sftp.cd(directory);
        }
        File file = new File(saveFile);
        sftp.get(downloadFile, new FileOutputStream(file));
    }

    public File downloadFile(String directory, String downloadFile, String saveFile) throws SftpException, FileNotFoundException {
        if (directory != null && !"".equals(directory)) {
            sftp.cd(directory);
        }
        File file = new File(saveFile);
        sftp.get(downloadFile, new FileOutputStream(file));
        return file;
    }

    public InputStream getIS(String directory, String downloadFile) throws SftpException, FileNotFoundException {
        if (directory != null && !"".equals(directory)) {
            sftp.cd(directory);
        }
        InputStream file = sftp.get(downloadFile);
        return file;
    }

    /**
     * 下载⽂文件
     *
     * @param directory    下载⽬目录
     * @param downloadFile 下载的⽂文件名 * @return 字节数组
     */
    public byte[] download(String directory, String downloadFile) throws SftpException, IOException {
        if (directory != null && !"".equals(directory)) {
            sftp.cd(directory);
        }
        InputStream is = sftp.get(downloadFile);
        byte[] fileData = IOUtils.toByteArray(is);
        return fileData;

//


// // // // // // // // // }
    }

    /**
     * 删除⽂文件
     *
     * @param directory 要删除⽂文件所在⽬目录 * @param deleteFile 要删除的⽂文件
     */
    public void delete(String directory, String deleteFile) throws SftpException {
        sftp.cd(directory);
        sftp.rm(deleteFile);
    }

    /**
     * 列列出⽬目录下的⽂文件
     *
     * @param directory 要列列出的⽬目录
     * @param sftp
     */
    public Vector<?> listFiles(String directory) throws SftpException {
        return sftp.ls(directory);
    }

    //上传⽂文件测试
//    public static void main(String[] args) throws SftpException, IOException, JSchException {
//        SFTPUtil sftp = new SFTPUtil("root", "Jgnzxcvbnm,666!", "39.106.56.132", 22);
//        sftp.login();
//        File file = new File("/Users/gjw/Desktop/01.jpg");
//        InputStream is = new FileInputStream(file);
//        sftp.upload("/root", "MeetFile", "01.jpg", is);
//        sftp.logout();
//    }
}