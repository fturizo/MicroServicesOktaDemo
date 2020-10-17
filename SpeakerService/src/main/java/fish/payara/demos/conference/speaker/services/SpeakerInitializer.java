package fish.payara.demos.conference.speaker.services;

import fish.payara.demos.conference.speaker.entitites.Speaker;
import java.util.logging.Logger;
import javax.enterprise.context.ApplicationScoped;
import javax.enterprise.context.Initialized;
import javax.enterprise.event.Observes;
import javax.inject.Inject;

/**
 * @author Fabio Turizo
 */
@ApplicationScoped
public class SpeakerInitializer {

    private static final Logger LOG = Logger.getLogger(SpeakerInitializer.class.getName());
    
    @Inject
    SpeakerService speakerService;
    
    public void initialize(@Observes @Initialized(ApplicationScoped.class) Object event){
        LOG.info("Initializing speakers");
        if(speakerService.getAll().isEmpty()){
            speakerService.save(new Speaker("Alan Roth", "Payara Services Ltd.").accept());
            speakerService.save(new Speaker("Rudy Debusscher", "Payara Tech").accept());
        }
    }
}
