using Azure.Storage.Blobs;
using Azure.Storage.Blobs.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;
using PASSIFY.Data;
using PASSIFY.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Threading.Tasks;

namespace PASSIFY.Controllers
{
    [Authorize]
    public class ActivitiesController : Controller
    {
        private readonly IConfiguration _configuration;
        private readonly PASSIFYContext _context;
        
        private readonly BlobContainerClient _containerClient;

        public ActivitiesController(IConfiguration configuration, PASSIFYContext context)
        {
            _context = context;
            _configuration = configuration;
            
            var connectionString = _configuration["AzureStorage"];
            var containerName = "uploads";
            _containerClient = new BlobContainerClient(connectionString, containerName);
        }
        
        [HttpGet("/Activities/{id:int}")]
        public IActionResult ShortUrl(int id)
        {
            return RedirectToAction(nameof(Details), new { id });
        }
        
         // GET: Activities/Create
        public IActionResult Create()
        {
            ViewData["CategoryId"] = new SelectList(_context.Set<Category>(), "CategoryId", "Title");
            ViewData["OrganizerId"] = new SelectList(_context.Set<Organizer>(), "OrganizerId", "Name");
            return View();
        }

        // POST: Activities/Create
        // To protect from overposting attacks, enable the specific properties you want to bind to.
        // For more details, see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create(
            [Bind("ActivityId,Title,Description,EventStart,EventEnd,OrganizerId,CategoryId,FormFile")]Activity activity)
        {
            activity.Created = DateTime.Now;
            activity.Modified = DateTime.Now;

            //Validate form input
            if (ModelState.IsValid)
            {
                
                if (activity.FormFile != null)
                {
                    //
                    IFormFile fileUpload = activity.FormFile;
                    
                    //path to save the file to
                    string blobName = Guid.NewGuid().ToString() + "_" + fileUpload.FileName;

                    var blobClient = _containerClient.GetBlobClient(blobName);
                    
                    using (var stream = fileUpload.OpenReadStream())
                    {
                        await blobClient.UploadAsync(stream, new BlobHttpHeaders { ContentType = fileUpload.ContentType });
                    }
                    
                    string blobURL = blobClient.Uri.ToString();
                    
                    // Get the URL of the blob file
                    activity.ImageName = blobURL;
                }

                //Save to a database
                _context.Add(activity);

                await _context.SaveChangesAsync();
                return RedirectToAction("Index", "Home");
            }

            ViewData["CategoryId"] = new SelectList(_context.Set<Category>(), "CategoryId", "CategoryId", activity.CategoryId);
            ViewData["OrganizerId"] = new SelectList(_context.Set<Organizer>(), "OrganizerId", "OrganizerId", activity.OrganizerId);
            return View(activity);
        }

        // GET: Activities/Details/5
        public async Task<IActionResult> Details(int? id)
        {
            if (id == null)
            {
                return RedirectToAction("Index", "Home");
            }

            var activity = await _context.Activity
                .Include(a => a.Category)
                .Include(a => a.Organizer)
                .Include(a => a.Purchases)
                .FirstOrDefaultAsync(m => m.ActivityId == id);
            if (activity == null)
            {
                return NotFound();
            }

            return View(activity);
        }
        
        // GET: Activities/5/Purchases
        [HttpGet("Activities/{id}/Purchases")]
        public async Task<IActionResult> Purchases(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var purchases = await _context.Activity
                .Include(a => a.Purchases)
                .FirstOrDefaultAsync(m => m.ActivityId == id);
            if (purchases == null)
            {
                return NotFound();
            }

            return View(purchases);
        }
        
        
        // GET: Activities/Edit/5
        public async Task<IActionResult> Edit(int? id)
        {
            if (id == null)
            {
                return RedirectToAction(nameof(Index));
            }

            var activity = await _context.Activity.FindAsync(id);
            if (activity == null)
            {
                return NotFound();
            }

            ViewData["CategoryId"] = new SelectList(_context.Set<Category>(), "CategoryId", "Title", activity.Category);
            ViewData["OrganizerId"] =
                new SelectList(_context.Set<Organizer>(), "OrganizerId", "Name", activity.Organizer);
            return View(activity);
        }

        // POST: Activities/Edit/5
        // To protect from overposting attacks, enable the specific properties you want to bind to.
        // For more details, see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Edit(int id,
            [Bind("ActivityId,Title,Description,EventStart,EventEnd,Created,Modified,OrganizerId,CategoryId")]
            Activity activity)
        {
            if (id != activity.ActivityId)
            {
                return NotFound();
            }

            if (ModelState.IsValid)
            {
                if(activity.FormFile != null) {

                    // determine new filename

                    // set the new filename in the db record

                    // upload the new file

                    // delete the old file
                }
                try
                {
                    activity.Modified = DateTime.Now;
                    _context.Update(activity);
                    await _context.SaveChangesAsync();
                }
                catch (DbUpdateConcurrencyException)
                {
                    if (!ActivityExists(activity.ActivityId))
                    {
                        return NotFound();
                    }
                    else
                    {
                        throw;
                    }
                }

                return RedirectToAction("Index", "Home");
            }

            ViewData["CategoryId"] = new SelectList(_context.Set<Category>(), "CategoryId", "CategoryId", activity.CategoryId);
            ViewData["OrganizerId"] = new SelectList(_context.Set<Organizer>(), "OrganizerId", "OrganizerId", activity.OrganizerId);
            return View(activity);
        }

        // GET: Activities/Delete/5
        public async Task<IActionResult> Delete(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var activity = await _context.Activity
                .Include(a => a.Category)
                .Include(a => a.Organizer)
                .FirstOrDefaultAsync(m => m.ActivityId == id);
            if (activity == null)
            {
                return NotFound();
            }

            return View(activity);
        }

        // POST: Activities/Delete/5
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> DeleteConfirmed(int id)
        {
            var activity = await _context.Activity.FindAsync(id);
            if (activity != null)
            {
                _context.Activity.Remove(activity);
            }

            await _context.SaveChangesAsync();
            return RedirectToAction("Index", "Home");
        }

        private bool ActivityExists(int id)
        {
            return _context.Activity.Any(e => e.ActivityId == id);
        }
    }
}