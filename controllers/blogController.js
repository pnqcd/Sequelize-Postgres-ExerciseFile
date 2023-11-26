const controller = {};
const models = require('../models');

controller.showList = async (req, res) => {
    // await sequelize.query('SELECT pg_notify(\'invalcache\', \'\')');

    allBlogs = await models.Blog.findAll({
        attributes: ['id', 'title', 'imagePath', 'summary', 'createdAt'],
        include: [
            { model: models.Category },
            { model: models.Tag },
            { model: models.Comment }
        ], 
    });

    categories = await models.Category.findAll({
        attributes: ['id', 'name'],
    });

    // res.locals.blogs = req.query.category ? allBlogs.filter((item) => item.Category.name == req.query.category) : allBlogs;

    tags = await models.Tag.findAll(( {
        attributes: ['id', 'name'] 
    }));

    res.locals.query = req.query.search;

    // res.locals.blogs = req.query.tag ? allBlogs.filter((item) => item.Tags.some(tag => tag.name == req.query.tag)) : allBlogs;

    if (req.query.search) 
        res.locals.blogs = allBlogs.filter((item) => item.title.toLowerCase().includes(req.query.search));
    else 
    if (req.query.category) 
        res.locals.blogs = allBlogs.filter((item) => item.Category.name == req.query.category);
    else if (req.query.tag) 
        res.locals.blogs = allBlogs.filter((item) => item.Tags.some(tag => tag.name == req.query.tag));
    else res.locals.blogs = allBlogs;

    res.locals.sidebarData = {
        categories,
        tags,
    };

    res.render('index');
}

controller.showDetails = async(req, res) => {
    let id = isNaN(req.params.id) ? 0 : parseInt(req.params.id);
    res.locals.blog = await models.Blog.findOne({
        attributes: ['id', 'title', 'description', 'createdAt'],
        where: { id: id },
        include: [
            { model: models.Category },
            { model: models.User },
            { model: models.Tag },
            { model: models.Comment }
        ]
    })
    res.render('details');
}

module.exports = controller;