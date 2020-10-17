package fish.payara.demos.conference.speaker.entitites;

import java.io.Serializable;
import java.util.Objects;
import javax.json.bind.annotation.JsonbCreator;
import javax.json.bind.annotation.JsonbProperty;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.NamedQuery;
import org.eclipse.microprofile.openapi.annotations.media.Schema;

/**
 * @author Fabio Turizo
 */
@Entity
@NamedQuery(name = "Speaker.all", query = "select sp from Speaker sp order by sp.id")
@Schema(description = "Stores speaker information")
public class Speaker implements Serializable{
    
    private static final String DEFAULT_IDENTITY = "none";
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    
    private String name;
    private String organization;
    
    @Column(name = "user_identity")
    private String identity;
    private Boolean accepted;

    public Speaker() {
    }

    @JsonbCreator
    public Speaker(@JsonbProperty("name") String name, @JsonbProperty("organization") String organization) {
        this.name = name;
        this.organization = organization;
        this.accepted = false;
        this.identity = DEFAULT_IDENTITY;
    }

    public Integer getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getOrganization() {
        return organization;
    }

    public boolean isAccepted() {
        return accepted;
    }
    
    public Speaker accept(){
        this.accepted = true;
        return this;
    }

    public String getIdentity() {
        return identity;
    }

    public Speaker setIdentity(String identity) {
        this.identity = identity;
        return this;
    }

    @Override
    public int hashCode() {
        int hash = 7;
        hash = 79 * hash + Objects.hashCode(this.id);
        return hash;
    }

    @Override
    public boolean equals(Object obj) {
        if (this == obj) {
            return true;
        }
        if (obj == null) {
            return false;
        }
        if (getClass() != obj.getClass()) {
            return false;
        }
        final Speaker other = (Speaker) obj;
        return Objects.equals(this.id, other.id);
    }
}
