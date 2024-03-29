package fish.payara.demos.conference.session.api;

import fish.payara.demos.conference.session.entities.Session;
import fish.payara.demos.conference.session.services.SessionService;
import java.security.Principal;
import java.util.List;
import jakarta.annotation.security.RolesAllowed;
import jakarta.enterprise.context.RequestScoped;
import jakarta.inject.Inject;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.NotFoundException;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.PathParam;
import jakarta.ws.rs.core.Response;

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
        var session = sessionService.retrieve(sessionId).orElseThrow(() -> new NotFoundException("No session found"));
        return Response.ok(sessionService.register(session, principal.getName())).build();
    }
    
    @GET
    @Path("/current")
    public List<Session> currentSessions(){
        return sessionService.retrieveRegisteredSessions(principal.getName());
    }
}
