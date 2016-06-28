window.matchMedia || (window.matchMedia = function() {
    "use strict";
    var styleMedia = window.styleMedia || window.media;
    if (!styleMedia) {
        var style = document.createElement("style"), script = document.getElementsByTagName("script")[0], info = null;
        style.type = "text/css", style.id = "matchmediajs-test", script.parentNode.insertBefore(style, script), 
        info = "getComputedStyle" in window && window.getComputedStyle(style, null) || style.currentStyle, 
        styleMedia = {
            matchMedium: function(media) {
                var text = "@media " + media + "{ #matchmediajs-test { width: 1px; } }";
                return style.styleSheet ? style.styleSheet.cssText = text : style.textContent = text, 
                "1px" === info.width;
            }
        };
    }
    return function(media) {
        return {
            matches: styleMedia.matchMedium(media || "all"),
            media: media || "all"
        };
    };
}()), function(w, doc) {
    "use strict";
    function picturefill(options) {
        var elements, element, elemType, firstMatch, candidates, picImg;
        options = options || {}, elements = options.elements || pf.getAllElements();
        for (var i = 0, plen = elements.length; plen > i; i++) if (element = elements[i], 
        elemType = element.nodeName.toUpperCase(), firstMatch = void 0, candidates = void 0, 
        picImg = void 0, element[pf.ns] || (element[pf.ns] = {}), options.reevaluate || !element[pf.ns].evaluated) {
            if ("PICTURE" === elemType) {
                if (pf.removeVideoShim(element), firstMatch = pf.getMatch(element), firstMatch === !1) continue;
                picImg = element.getElementsByTagName("img")[0];
            } else firstMatch = void 0, picImg = element;
            picImg && (picImg[pf.ns] || (picImg[pf.ns] = {}), picImg.srcset && ("PICTURE" === elemType || picImg.getAttribute("sizes")) && pf.dodgeSrcset(picImg), 
            firstMatch ? (candidates = pf.processSourceSet(firstMatch), pf.applyBestCandidate(candidates, picImg)) : (candidates = pf.processSourceSet(picImg), 
            (void 0 === picImg.srcset || picImg[pf.ns].srcset) && pf.applyBestCandidate(candidates, picImg)), 
            element[pf.ns].evaluated = !0);
        }
    }
    function runPicturefill() {
        picturefill();
        var intervalId = setInterval(function() {
            return picturefill(), /^loaded|^i|^c/.test(doc.readyState) ? void clearInterval(intervalId) : void 0;
        }, 250);
        if (w.addEventListener) {
            var resizeThrottle;
            w.addEventListener("resize", function() {
                w._picturefillWorking || (w._picturefillWorking = !0, w.clearTimeout(resizeThrottle), 
                resizeThrottle = w.setTimeout(function() {
                    picturefill({
                        reevaluate: !0
                    }), w._picturefillWorking = !1;
                }, 60));
            }, !1);
        }
    }
    if (!w.HTMLPictureElement) {
        doc.createElement("picture");
        var pf = {};
        pf.ns = "picturefill", pf.srcsetSupported = void 0 !== new w.Image().srcset, pf.trim = function(str) {
            return str.trim ? str.trim() : str.replace(/^\s+|\s+$/g, "");
        }, pf.endsWith = function(str, suffix) {
            return str.endsWith ? str.endsWith(suffix) : -1 !== str.indexOf(suffix, str.length - suffix.length);
        }, pf.matchesMedia = function(media) {
            return w.matchMedia && w.matchMedia(media).matches;
        }, pf.getDpr = function() {
            return w.devicePixelRatio || 1;
        }, pf.getWidthFromLength = function(length) {
            return length = length && parseFloat(length) > 0 ? length : "100vw", length = length.replace("vw", "%"), 
            pf.lengthEl || (pf.lengthEl = doc.createElement("div"), doc.documentElement.insertBefore(pf.lengthEl, doc.documentElement.firstChild)), 
            pf.lengthEl.style.cssText = "position: absolute; left: 0; width: " + length + ";", 
            pf.lengthEl.offsetWidth;
        }, pf.types = {}, pf.types["image/jpeg"] = !0, pf.types["image/gif"] = !0, pf.types["image/png"] = !0, 
        pf.types["image/svg+xml"] = doc.implementation.hasFeature("http://www.w3.org/TR/SVG11/feature#Image", "1.1"), 
        pf.types["image/webp"] = function() {
            var img = new w.Image(), type = "image/webp";
            img.onerror = function() {
                pf.types[type] = !1, picturefill();
            }, img.onload = function() {
                pf.types[type] = 1 === img.width, picturefill();
            }, img.src = "data:image/webp;base64,UklGRh4AAABXRUJQVlA4TBEAAAAvAAAAAAfQ//73v/+BiOh/AAA=";
        }, pf.verifyTypeSupport = function(source) {
            var type = source.getAttribute("type");
            return null === type || "" === type ? !0 : "function" == typeof pf.types[type] ? (pf.types[type](), 
            "pending") : pf.types[type];
        }, pf.parseSize = function(sourceSizeStr) {
            var match = /(\([^)]+\))?\s*(.+)/g.exec(sourceSizeStr);
            return {
                media: match && match[1],
                length: match && match[2]
            };
        }, pf.findWidthFromSourceSize = function(sourceSizeListStr) {
            for (var winningLength, sourceSizeList = pf.trim(sourceSizeListStr).split(/\s*,\s*/), i = 0, len = sourceSizeList.length; len > i; i++) {
                var sourceSize = sourceSizeList[i], parsedSize = pf.parseSize(sourceSize), length = parsedSize.length, media = parsedSize.media;
                if (length && (!media || pf.matchesMedia(media))) {
                    winningLength = length;
                    break;
                }
            }
            return pf.getWidthFromLength(winningLength);
        }, pf.parseSrcset = function(srcset) {
            for (var candidates = []; "" !== srcset; ) {
                srcset = srcset.replace(/^\s+/g, "");
                var url, pos = srcset.search(/\s/g), descriptor = null;
                if (-1 !== pos) {
                    url = srcset.slice(0, pos);
                    var last = url[url.length - 1];
                    if (("," === last || "" === url) && (url = url.replace(/,+$/, ""), descriptor = ""), 
                    srcset = srcset.slice(pos + 1), null === descriptor) {
                        var descpos = srcset.indexOf(",");
                        -1 !== descpos ? (descriptor = srcset.slice(0, descpos), srcset = srcset.slice(descpos + 1)) : (descriptor = srcset, 
                        srcset = "");
                    }
                } else url = srcset, srcset = "";
                (url || descriptor) && candidates.push({
                    url: url,
                    descriptor: descriptor
                });
            }
            return candidates;
        }, pf.parseDescriptor = function(descriptor, sizes) {
            var resCandidate, sizeDescriptor = descriptor && descriptor.replace(/(^\s+|\s+$)/g, ""), widthInCssPixels = sizes ? pf.findWidthFromSourceSize(sizes) : "100%";
            if (sizeDescriptor) for (var splitDescriptor = sizeDescriptor.split(" "), i = splitDescriptor.length + 1; i >= 0; i--) {
                var curr = splitDescriptor[i], lastchar = curr && curr.slice(curr.length - 1);
                if (("w" === lastchar || "x" === lastchar) && (resCandidate = curr), sizes && resCandidate) resCandidate = parseFloat(parseInt(curr, 10) / widthInCssPixels); else {
                    var res = curr && parseFloat(curr, 10);
                    resCandidate = res && !isNaN(res) && "x" === lastchar || "w" === lastchar ? res : 1;
                }
            } else resCandidate = 1;
            return resCandidate;
        }, pf.getCandidatesFromSourceSet = function(srcset, sizes) {
            for (var candidates = pf.parseSrcset(srcset), formattedCandidates = [], i = 0, len = candidates.length; len > i; i++) {
                var candidate = candidates[i];
                formattedCandidates.push({
                    url: candidate.url,
                    resolution: pf.parseDescriptor(candidate.descriptor, sizes)
                });
            }
            return formattedCandidates;
        }, pf.dodgeSrcset = function(img) {
            img.srcset && (img[pf.ns].srcset = img.srcset, img.removeAttribute("srcset"));
        }, pf.processSourceSet = function(el) {
            var srcset = el.getAttribute("srcset"), sizes = el.getAttribute("sizes"), candidates = [];
            return "IMG" === el.nodeName.toUpperCase() && el[pf.ns] && el[pf.ns].srcset && (srcset = el[pf.ns].srcset), 
            srcset && (candidates = pf.getCandidatesFromSourceSet(srcset, sizes)), candidates;
        }, pf.applyBestCandidate = function(candidates, picImg) {
            var candidate, length, bestCandidate;
            candidates.sort(pf.ascendingSort), length = candidates.length, bestCandidate = candidates[length - 1];
            for (var i = 0; length > i; i++) if (candidate = candidates[i], candidate.resolution >= pf.getDpr()) {
                bestCandidate = candidate;
                break;
            }
            pf.endsWith(picImg.src, bestCandidate.url) || (picImg.src = bestCandidate.url, picImg.currentSrc = picImg.src);
        }, pf.ascendingSort = function(a, b) {
            return a.resolution - b.resolution;
        }, pf.removeVideoShim = function(picture) {
            var videos = picture.getElementsByTagName("video");
            if (videos.length) {
                for (var video = videos[0], vsources = video.getElementsByTagName("source"); vsources.length; ) picture.insertBefore(vsources[0], video);
                video.parentNode.removeChild(video);
            }
        }, pf.getAllElements = function() {
            for (var pictures = doc.getElementsByTagName("picture"), elems = [], imgs = doc.getElementsByTagName("img"), h = 0, len = pictures.length + imgs.length; len > h; h++) if (h < pictures.length) elems[h] = pictures[h]; else {
                var currImg = imgs[h - pictures.length];
                "PICTURE" !== currImg.parentNode.nodeName.toUpperCase() && (pf.srcsetSupported && currImg.getAttribute("sizes") || null !== currImg.getAttribute("srcset")) && elems.push(currImg);
            }
            return elems;
        }, pf.getMatch = function(picture) {
            for (var match, sources = picture.childNodes, j = 0, slen = sources.length; slen > j; j++) {
                var source = sources[j];
                if (1 === source.nodeType) {
                    if ("IMG" === source.nodeName.toUpperCase()) return match;
                    if ("SOURCE" === source.nodeName.toUpperCase()) {
                        var media = source.getAttribute("media");
                        if (source.getAttribute("srcset") && (!media || pf.matchesMedia(media))) {
                            var typeSupported = pf.verifyTypeSupport(source);
                            if (typeSupported === !0) {
                                match = source;
                                break;
                            }
                            if ("pending" === typeSupported) return !1;
                        }
                    }
                }
            }
            return match;
        }, runPicturefill(), picturefill._ = pf, "object" == typeof module && "object" == typeof module.exports ? module.exports = picturefill : "function" == typeof define && define.amd ? define(function() {
            return picturefill;
        }) : "object" == typeof w && (w.picturefill = picturefill);
    }
}(this, this.document);