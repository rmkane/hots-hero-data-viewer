const heroData = new HeroData('Cassia', {
  callback: onLoad
});

const templates = {
  view: null
};

const levels = [1, 4, 7, 10, 13, 16, 20];

Handlebars.registerHelper({
  format_level: tier => levels[tier - 1],
  renderImage: function() {
    return heroData.defaultImageFilename(this.icon);
  },
  formattedFileName: function() {
    return this.name + ' Icon';
  }
});

// Should finish loading before onLoad is called.
loadTemplate('templates/view.hbs')
  .then(template => {
    templates.view = template;
  });

function onLoad(hero) {
  console.log(JSON.stringify(hero._uniqueIconNames(), null, 2));
  renderView(hero);
}

function renderView(viewModel) {
  document.getElementById('target').innerHTML = templates.view(viewModel);
}

function loadTemplate(filename) {
  return fetch(filename)
    .then((response) => response.text())
    .then((template) => Handlebars.compile(template));
}