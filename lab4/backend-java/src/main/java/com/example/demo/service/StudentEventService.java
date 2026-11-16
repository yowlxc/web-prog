package com.example.demo.service;

import org.springframework.stereotype.Service;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.util.List;
import java.util.concurrent.CopyOnWriteArrayList;

@Service
public class StudentEventService {
    // храним все открытые соединения (вкладки пользователей)
    private final List<SseEmitter> emitters = new CopyOnWriteArrayList<>();

    public SseEmitter subscribe() {
        SseEmitter emitter = new SseEmitter(Long.MAX_VALUE); // Держим соединение вечно
        emitters.add(emitter);

        // удаляем соединение, когда вкладка закрывается
        emitter.onCompletion(() -> emitters.remove(emitter));
        emitter.onTimeout(() -> emitters.remove(emitter));

        return emitter;
    }

    // отправить сигнал во все открытые вкладки
    public void broadcast() {
        for (SseEmitter emitter : emitters) {
            try {
                emitter.send(SseEmitter.event().name("update").data("refresh"));
            } catch (Exception e) {
                emitters.remove(emitter);
            }
        }
    }
}
