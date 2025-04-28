package org.IMeeting.util;

import com.jcraft.jsch.SftpException;

import java.util.ArrayList;
import java.util.List;
import java.util.Vector;

/**
 * Created by gjw on 2019/5/2.
 */
public class test {
    public static void main(String arugs[]) throws SftpException {
//        DecimalFormat df=new DecimalFormat("0.00");
//        System.out.println(df.format((float)60/114));
//        Date addDay= DateUtil.addDay(new Date(),-14);
//        SimpleDateFormat simpleDateFormat=new SimpleDateFormat("yyyy-MM-dd");
//        System.out.println(simpleDateFormat.format(addDay));
//        List<Object> list = new ArrayList<>();
//        List<String> list1;
//        for (int i = 0; i < 3; i++) {
//            list1=new ArrayList<>();
//            list1.add("meetRoom" + i);
//            list1.add(Math.random() * 10);
//        }
//        for (Object o : list) {
//            System.out.println(o);
//        }
//        Comparator comparator= Collections.reverseOrder();
//        Collections.sort(list,comparator);
//        Iterator iterator_reverse=list.iterator();
//        while(iterator_reverse.hasNext()){
//            list1 s=(Student)iterator_reverse.next();
//            System.out.println(s.getName()+" "+s.getAge());
//        }
//
//        String privStr = "-----BEGIN PRIVATE KEY-----\n" +
//                "MIGHAgEAMBMGByqGSM49AgEGCCqGSM49AwEHBG0wawIBAQQgD5PeS6Qtywn8mo0Q\n" +
//                "UHdvweAnZbqP8WbQVSnFJmGpm+yhRANCAAQdjpZQaB1JNU/GGIk0zLKulhNviqHC\n" +
//                "/wMDdiPhUCyeP1PvXPdyCNwrIiFUMZYWBRHf0LJ/PRlMSH8Y2siE0iFy\n" +
//                "-----END PRIVATE KEY-----\n";
//
//        //change public pem string to public string
//        String pubStr = "-----BEGIN PUBLIC KEY-----\n" +
//                "MFkwEwYHKoZIzj0CAQYIKoZIzj0DAQcDQgAEHY6WUGgdSTVPxhiJNMyyrpYTb4qh\n" +
//                "wv8DA3Yj4VAsnj9T71z3cgjcKyIhVDGWFgUR39Cyfz0ZTEh/GNrIhNIhcg==\n" +
//                "-----END PUBLIC KEY-----\n";
//        tls_sigature.GenTLSSignatureResult result = tls_sigature.GenTLSSignatureEx(1400208454, "12321", privStr);
////        Assert.assertNotEquals(null, result);
////        Assert.assertNotEquals(null, result.urlSig);
////        Assert.assertNotEquals(0, result.urlSig.length());
//        System.out.println(result.urlSig);
//        System.out.println(new Date().getTime());
        SFTPUtil sftp = new SFTPUtil("root", "Jgnzxcvbnm,666!", "39.106.56.132", 22);
        sftp.login();
        Vector<?> sftpList= sftp.listFiles("/root/Face");
        List<String> files=new ArrayList<>();
        for(int i=0;i<sftpList.size();i++){
            int idx = sftpList.get(i).toString().indexOf("test");
            String str = null;
            if(idx != -1) {
                str = sftpList.get(i).toString().substring(idx);
                files.add(str);
            }
//            if(str != null)
//                System.out.println(str);
            //System.out.println(sftpList.get(i));
        }
        sftp.logout();
        for (int i=0;i<files.size();i++){
            System.out.println(files.get(i));
        }


    }
}
