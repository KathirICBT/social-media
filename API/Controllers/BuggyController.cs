using System;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

public class BuggyController : BaseApiController
{
    [HttpGet("auth")]
    public IActionResult GetPerson()
    {
        return Unauthorized();
    }

    [HttpGet("not-found")]
    public IActionResult GetNotFound()
    {
        return NotFound();
    }

    [HttpGet("server-error")]
    public IActionResult GetServerError()
    {
        throw new Exception("This is a server error");
    }

    [HttpGet("bad-request")]
    public IActionResult GetBadRequest()
    {
        return BadRequest("This is a bad request");
    }

    // [HttpGet("validation-error")]
    // public IActionResult GetValidationError()
    // {
    //     ModelState.AddModelError("Problem1", "This is the first error");
    //     ModelState.AddModelError("Problem2", "This is the second error");
    //     ModelState.AddModelError("Problem3", "This is the third error");

    //     return ValidationProblem();
    // }


}
