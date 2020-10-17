package fish.payara.demos.conference.speaker.services;

import fish.payara.demos.conference.speaker.entitites.Speaker;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import javax.enterprise.context.ApplicationScoped;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.transaction.Transactional;

/**
 * @author Fabio Turizo
 */
@ApplicationScoped
public class SpeakerService {
    
    @PersistenceContext(unitName = "Speaker")
    EntityManager em;
    
    @Transactional
    public Speaker save(Speaker speaker){
        if(speaker.getId() == null){
            em.persist(speaker);
        }else{
            em.merge(speaker);
        }
        em.flush();
        return speaker;
    }
    
    public Optional<Speaker> get(Integer id){
        return Optional.ofNullable(em.find(Speaker.class, id));
    }
    
    public List<Speaker> getAll(){
        return em.createNamedQuery("Speaker.all", Speaker.class)
                 .getResultList();
    }
    
    public boolean allNamesExists(List<String> names){
        List<String> allNames = getAll().stream().map(Speaker::getName).collect(Collectors.toList());
        return names.stream().allMatch(allNames::contains);
    }
}
