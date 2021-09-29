package fish.payara.demos.conference.session.api;

import fish.payara.demos.conference.session.entities.Session;
import fish.payara.demos.conference.session.services.SessionService;
import org.eclipse.microprofile.jwt.JsonWebToken;

import java.net.URI;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import javax.annotation.security.RolesAllowed;
import javax.enterprise.context.RequestScoped;
import javax.inject.Inject;
import javax.ws.rs.Consumes;
import javax.ws.rs.DELETE;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.Status;

/**
 *
 * @author Fabio Turizo
 */
@Path("/session")
@RequestScoped
@Produces(MediaType.APPLICATION_JSON)
@RolesAllowed("Admin")
public class SessionResource {

    @Inject
    SessionService sessionService;

    @POST
    @Consumes(MediaType.APPLICATION_JSON)
    public Response create(Session session) {
        session = sessionService.addNewSession(session);
        return Response.created(URI.create("/" + session.getId()))
                .entity(session).build();
    }
    
    @GET
    @Path("/all")
    @RolesAllowed({"Admin", "Attendee"})
    public List<Session> getAll() {
        return sessionService.retrieveSessions();
    }

    @GET
    @Path("/{id}")
    public Response get(@PathParam("id") Integer id) {
        return sessionService.retrieve(id).map(Response::ok)
                .orElse(Response.status(Status.NOT_FOUND)).build();
    }

    @DELETE
    @Path("/{id}")
    public Response delete(@PathParam("id") Integer id) {
        Optional<Session> session = sessionService.retrieve(id);
        if (session.isPresent()) {
            sessionService.delete(session.get());
            return Response.accepted().build();
        } else {
            return Response.status(Status.NOT_FOUND).build();
        }
    }

    @GET
    @Path("/date/{date}")
    public List<Session> forDate(@PathParam("date") String date) {
        return sessionService.retrieve(LocalDate.parse(date));
    }
}
