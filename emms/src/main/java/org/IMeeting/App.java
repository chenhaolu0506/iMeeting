package org.IMeeting;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class App {
    public static void main(String[] args) {
        try {
            SpringApplication.run(App.class, args);
        } catch (Throwable e) {
            e.printStackTrace();
        }
    }
}