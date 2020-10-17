package fish.payara.demos.conference.session.api;

import fish.payara.demos.conference.session.entities.Session;
import fish.payara.demos.conference.session.services.SessionService;
import java.security.Principal;
import java.util.List;
import javax.annotation.security.RolesAllowed;
import javax.enterprise.context.RequestScoped;
import javax.inject.Inject;
import javax.ws.rs.GET;
import javax.ws.rs.NotFoundException;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.core.Response;

/**
 *
 * @author fabio
 */
@Path("/register")
@RequestScoped
@RolesAllowed("Attendee")
public class RegistrationResource {
    
    @Inject
    SessionService sessionService;
    
    @Inject
    Principal principal;
    
    @POST
    @Path("/{sessionId}")
    public Response register(@PathParam("sessionId") Integer sessionId){
        Session session = sessionService.retrieve(sessionId).orElseThrow(() -> new NotFoundException("No session found"));
        return Response.ok(sessionService.register(session, principal.getName())).build();
    }
    
    @GET
    @Path("/current")
    public List<Session> currentSessions(){
        return sessionService.retrieveRegisteredSessions(principal.getName());
    }
}
