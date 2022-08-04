const scale = 96 / 72 * 0.264583333;

class PDFDocument {

    constructor(filename, pdf, colorValue) {
        this.filename = filename;
        this.pdf = pdf;
        this.nbPages = pdf.numPages;
        this.colorValue = colorValue;
        this.priceTotal = 0;
        this.pdfPages = [];
    }

    async init () {
        this.pdfPages = await this.getPdfPages();
        this.priceTotal = this.getPriceTotal();
    }

    getPriceTotal() {
        let sum = 0;
        this.pdfPages.forEach(pdfPage => sum += pdfPage.price);
        return sum;
    }

    toString() {
        let text = "<hr/><br/>";
        text += this.filename + "<br/>";
        text += this.nbPages + " pages<br/>";
        text += this.priceTotal.toFixed(2) + "€<br/>";
        text += "Impression: " + (this.colorValue === 'black' ? 'Noir' : 'Couleur') + "<br/>";
        text += '<div class="table-responsive"><table class="table">';
        text += '<thead><tr>';
        text += '<th>#</th>';
        text += '<th>Largeur</th>';
        text += '<th>Hauteur</th>';
        text += '<th>Format</th>';
        text += '<th>Surface</th>';
        text += '<th>Prix</th>';
        text += '</tr></thead><tbody>';
        for (let index = 0; index < this.pdfPages.length; index++) {
            text += '<tr><td>' + (index + 1) + '</td>' + this.pdfPages[index].toString() + '</tr>';
        }
        text += '</tbody></table></div><br/>';
        return text;
    }

    async getPdfPages() {
        let pages = []
        for(let pageNumber = 1; pageNumber <= this.nbPages; pageNumber++) {
            pages.push(new PDFPage(await this.pdf.getPage(pageNumber), this.colorValue));
        }
        return pages;
    }

}

class PDFPage {

    constructor(pdfPage, colorValue) {
        this.pdfPage = pdfPage;
        this.colorValue = colorValue;
        this.width = this.getPageWidth();
        this.height = this.getPageHeight();
        this.pageFormat = this.getPageFormat();
        this.surface = this.getPageSurface(); // in m²
        this.price = this.getPrice();
    }

    toString() {
        return "<td>" + this.width + "</td>"
               + "<td>" + this.height + "</td>"
               + "<td>" + this.pageFormat + "</td>"
               + "<td>" + this.surface.toFixed(3) + "m²</td>"
               + "<td>" + this.price.toFixed(2) + "€</td>";
    }

    getPrice() {
        if (this.colorValue === 'black') {
            return this.pageFormat === 'A4' ? 0.07 : this.surface * 2.5;
        } else {
            return this.pageFormat === 'A4' ? 0.15 : this.surface * 4.3;
        }
    }

    getPageSurface() {
        return (this.width * this.height) / 1_000_000;
    }

    getPageWidth() {
        return Math.round(this.pdfPage.view[2] * scale);
    }

    getPageHeight() {
        return Math.round(this.pdfPage.view[3] * scale);
    }

    getPageFormat() {
        if (this.isA0()) {
            return 'A0';
        } else if (this.isA1()) {
            return 'A1';
        } else if (this.isA2()) {
            return 'A2';
        } else if (this.isA3()) {
            return 'A3';
        } else if (this.isA4()) {
            return 'A4';
        } else if (this.isA5()) {
            return 'A5';
        } else if (this.isA6()) {
            return 'A6';
        } else {
            return 'Pas de format';
        }
    }

    isA0() {
        return (this.width >= 840 && this.width <= 842 && this.height >= 1187 && this.height <= 1189) || (this.height >= 840 && this.height <= 842 && this.width >= 1187 && this.width <= 1189);
    }

    isA1() {
        return (this.width >= 593 && this.width <= 595 && this.height >= 840 && this.height <= 842) || (this.height >= 593 && this.height <= 595 && this.width >= 840 && this.width <= 842);
    }

    isA2() {
        return (this.width >= 419 && this.width <= 421 && this.height >= 593 && this.height <= 595) || (this.height >= 419 && this.height <= 421 && this.width >= 593 && this.width <= 595);
    }

    isA3() {
        return (this.width >= 296 && this.width <= 298 && this.height >= 419 && this.height <= 421) || (this.height >= 296 && this.height <= 298 && this.width >= 419 && this.width <= 421);
    }

    isA4() {
        return (this.width >= 209 && this.width <= 211 && this.height >= 296 && this.height <= 298) || (this.height >= 209 && this.height <= 211 && this.width >= 296 && this.width <= 298);
    }

    isA5() {
        return (this.width >= 147 && this.width <= 149 && this.height >= 209 && this.height <= 211) || (this.height >= 147 && this.height <= 149 && this.width >= 209 && this.width <= 211);
    }

    isA6() {
        return (this.width >= 104 && this.width <= 106 && this.height >= 147 && this.height <= 149) || (this.height >= 104 && this.height <= 106 && this.width >= 147 && this.width <= 149);
    }
}