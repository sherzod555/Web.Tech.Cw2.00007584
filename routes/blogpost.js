const fs = require('fs')
const path = require('path')
const express = require("express")
const router = express.Router()

const Validator = require("../services/validators")
const DbContext = require("../services/db")
const root = require("../utils").root;
const getCollection = require("../utils").getCollection;

const dbc = new DbContext()
const v = new Validator()
dbc.useCollection("blogposts.json")

router.get("/", (req, res) => {
  dbc.getAll(
    records => res.render("all_blogpost", { blogpost: records }),
    () => res.render("all_blogpost", { blogpost: null })
  )
})

router.get("/create-blogpost", (req, res) => {
  res.render("create_blogpost", {})
});

router.post("/create-blogpost", (req, res) => {
  if (v.isValid(req.body)) {
    dbc.saveOne(req.body, () => res.render("create_blogpost", { success: true }))
  } else {
    res.render("create_blogpost", { error: true, success: false })
  }
})

router.get('/:id/delete', (req, res) => {
  dbc.deleteOne(
    req.params.id, 
    () => res.redirect('/')),
    () => res.sendStatus(500)
})

router.get("/:id/archive", (req, res) => {
  fs.readFile(getCollection('blogposts.json'), (err, data) => {
    if (err) res.sendStatus(500)

    const blogposts = JSON.parse(data)
    const blogpost = blogpost.filter(blogpost => blogpost.id == req.params.id)[0]
    const blogpostIdx = blogpost.indexOf(blogpost)
    const splicedNote = blogpost.splice(blogpostIdx, 1)[0]
    splicedNote.archive = true
    blogpost.push(splicedNote)

    fs.writeFile(getCollection('blogposts.json'), JSON.stringify(blogpost), err => {
      if (err) res.sendStatus(500)

      res.redirect('/blogpost')
    })
    
  })
})

router.get("/:id", (req, res) => {
  dbc.getOne(
    req.params.id,
    record => res.render("blogpost_detail", { blogpost: record }),
    () => res.sendStatus(404)
  )
})

module.exports = router;

