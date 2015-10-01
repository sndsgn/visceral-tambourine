# Contributing to Yodel

Want to help make Yodel awesomer??

*Here's how:*

Please read through these guidelines to make contributing to Yodel painless and happy for both you the altruistic
soul and the tireless developers who brought Yodel into this world. 

###Coding Guidelines:

Follow [Hack Reactor Javascript style guide](https://github.com/hackreactor-labs/style-guide)   
Heavily comment all aspects of your code.  
Write tests for every core feature  
Write documentation for every core feature  


## General Workflow

1. [Fork the project](https://help.github.com/fork-a-repo/)
2. Add upstream, `git remote add upstream https://github.com/visceral-tambourine/visceral-tambourine.git`  
3. Cut a feature branch, `git checkout -b [feature-branch-name]`, for your work and follow this branch naming convention:  
  - bug/...
  - feat/...
  - test/...
  - doc/...
  - refactor/...
4. Make commits to your feature branch and prefix each commit like so:
  - (feat) Added a new feature
  - (fix) Fixed inconsistent tests [Fixes #0] ***REFERENCE GITHUB ISSUE NUMBER WITH GITHUG KEYWORD SUCH AS FIXES IN BRACKETS FOR WAFFLE IO AUTOMATION
  - (refactor) ...
  - (cleanup) ...
  - (test) ...
  - (doc) ...
  - `git commit -m "(fix) Fixed inconsistent tests [Fixes #0]"`
  -Keywords for closing issues - The following keywords will close an issue via commit message:
    +close
    +closes
    +closed
    +fix
    +fixes
    +fixed
    +resolve
    +resolves
    +resolved
5. Make changes to your feature branch. When ready to make a pull request, pull down changes from upstream master to feature branch. 
  -git pull --rebase upstream master
  -Because rebase changes commits, you will have to push with the -f or --force flag to your branch after rebasing, as the history has changed in a way that git cannot resolve. You should never rebase or push with force to the master branch of your repository, as that will invalidate everyone elses' clones and checkouts of the repository.
   directly to master. Include a description of your changes.
6. If you run into merge conflict issues, correct them and then continue the rebase. You pick a file by git adding it. Do not make commits during a rebase. Once you are done fixing conflicts for a specific commit, run:
  `git rebase --continue`
7. Push to your fork's feature branch  **** NEVER PUSH ORIGIN UPSTREAM MASTER *** WE ALL HAVE RIGHTS TO DO IT, BUT IT CAN COMPROMISE OUR CODE
  `git push origin feature-branch-name`
8. Make a clear pull request from your fork and branch to the upstream master branch, detailing exactly what changes you made and what feature this should add. The clearer your pull request is the faster you can get your changes incorporated into this repo.  At least one other person MUST give your changes a code review, and once they are satisfied they will merge your changes into upstream. Alternatively, they may have some requested changes. You should make more commits to your branch to fix these, then follow this process again from rebasing onwards.
  -[pull request](https://help.github.com/articles/using-pull-requests/)
9. If changes need to be made, make the corrections, make commits, do  git pull --rebase upstream master, fix any conflicts, then do git push origin feature-branch-name, respond to comment on original pull request to person reviewing the pull request by using the @ sign and their username, and they will be able to merge the commits without you having to make another pull request.  

## Checklist:

This is just to help you organize your process

- [ ] Did I cut my work branch off of master (don't cut new branches from existing feature brances)?
- [ ] Did I follow the correct naming convention for my branch?
- [ ] Is my branch focused on a single main change?
 - [ ] Do all of my changes directly relate to this change?
- [ ] Did I rebase the upstream master branch after I finished all my
  work?
- [ ] Did I write a clear pull request message detailing what changes I made?
- [ ] Did I get a code review?
- [ ] Did I make any requested changes from that code review?

If you follow all of these guidelines and make good changes, you should have
no problem getting your changes merged in.

